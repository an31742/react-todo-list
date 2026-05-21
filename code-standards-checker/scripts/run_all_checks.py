#!/usr/bin/env python3
"""
Code Standards Checker - Automated check runner.
Scans source files for common code standard violations and outputs a structured report.
"""

import os
import re
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime
from collections import defaultdict


# Severity colors for report
SEV_HIGH = "🔴 High"
SEV_MED = "🟡 Medium"
SEV_LOW = "🟢 Low"


class CodeChecker:
    def __init__(self, target_path):
        self.target = Path(target_path).resolve()
        self.issues = defaultdict(list)
        self.file_count = 0
        self.extensions = {'.js', '.jsx', '.ts', '.tsx', '.css'}

    def is_source_file(self, path):
        return path.suffix in self.extensions

    def should_ignore(self, path):
        ignore_dirs = {'node_modules', 'build', 'dist', '.git', '.vercel',
                      '__pycache__', 'coverage', 'public'}
        parts = path.parts
        for part in parts:
            if part in ignore_dirs:
                return True
        return False

    def get_source_files(self, subpath=None):
        base = self.target if subpath is None else self.target / subpath
        files = []
        for f in base.rglob('*'):
            if self.should_ignore(f):
                continue
            if self.is_source_file(f) and f.is_file():
                files.append(f)
        return files

    def check(self, files=None):
        """Run all checks."""
        if files is None:
            files = self.get_source_files()

        self.file_count = len(files)

        for filepath in files:
            try:
                content = filepath.read_text(encoding='utf-8', errors='ignore')
            except Exception:
                continue

            relpath = filepath.relative_to(self.target)

            self._check_formatting(content, relpath)
            self._check_framework(content, relpath, filepath.suffix)
            self._check_security(content, relpath)
            self._check_performance(content, relpath, filepath.suffix)
            self._check_naming(content, relpath, filepath.suffix)

        return self.issues

    # ── Formatting checks ──────────────────────────────────────────

    def _check_formatting(self, content, relpath):
        lines = content.split('\n')

        # Check indentation consistency
        has_tabs = any(line.startswith('\t') for line in lines if line.strip())
        has_spaces = any(line.startswith('  ') and not line.startswith('   ')
                        for line in lines if line.strip())
        if has_tabs:
            self.issues["代码格式"].append({
                "file": str(relpath), "line": 1,
                "desc": "文件使用了 Tab 缩进，项目应使用 2 空格缩进",
                "severity": SEV_MED,
                "suggestion": "将 Tab 替换为 2 个空格"
            })

        # Check line length
        for i, line in enumerate(lines, 1):
            if len(line) > 120:
                self.issues["代码格式"].append({
                    "file": str(relpath), "line": i,
                    "desc": f"行过长 ({len(line)} 字符，建议 100 字符以内)",
                    "severity": SEV_LOW,
                    "suggestion": "将长行拆分为多行"
                })

        # Check trailing whitespace
        for i, line in enumerate(lines, 1):
            if line.rstrip() != line and line.strip():
                self.issues["代码格式"].append({
                    "file": str(relpath), "line": i,
                    "desc": "行尾有多余空格",
                    "severity": SEV_LOW,
                    "suggestion": "删除行尾空格"
                })

        # Check missing trailing newline
        if content and not content.endswith('\n'):
            self.issues["代码格式"].append({
                "file": str(relpath), "line": len(lines),
                "desc": "文件末尾缺少换行符",
                "severity": SEV_LOW,
                "suggestion": "在文件末尾添加一个空行"
            })

    # ── Framework checks ──────────────────────────────────────────

    def _check_framework(self, content, relpath, suffix):
        # Check for class components (React anti-pattern in modern code)
        if suffix in ('.js', '.jsx', '.tsx'):
            if re.search(r'extends\s+(React\.)?Component', content):
                self.issues["框架规范"].append({
                    "file": str(relpath), "line": self._find_line(content, r'extends\s+(React\.)?Component'),
                    "desc": "使用了类组件，建议改用函数组件 + Hooks",
                    "severity": SEV_LOW,
                    "suggestion": "重构为函数组件"
                })

        # Check useEffect missing dependencies
        if suffix in ('.js', '.jsx', '.tsx'):
            # Find useEffect without deps array or with inaccurate deps
            for m in re.finditer(r'useEffect\s*\(\s*\(\)\s*=>\s*\{([^}]+)\}(?!\s*,\s*\[)', content, re.DOTALL):
                line = content[:m.start()].count('\n') + 1
                self.issues["框架规范"].append({
                    "file": str(relpath), "line": line,
                    "desc": "useEffect 缺少依赖数组，可能导致无限循环",
                    "severity": SEV_HIGH,
                    "suggestion": "添加依赖数组 useEffect(() => ..., [deps])"
                })

        # Check for direct DOM manipulation in React files
        if suffix in ('.js', '.jsx', '.tsx'):
            for m in re.finditer(r'document\.(getElementById|querySelector)', content):
                line = content[:m.start()].count('\n') + 1
                self.issues["框架规范"].append({
                    "file": str(relpath), "line": line,
                    "desc": "在 React 组件中直接操作 DOM，应使用 ref/state 管理",
                    "severity": SEV_MED,
                    "suggestion": "使用 useRef 或 state 替代 DOM 操作"
                })

        # Check Node.js error handling
        if str(relpath).startswith('server') or str(relpath).startswith('routes'):
            if 'async' in content and 'try' not in content and ('catch' not in content):
                for m in re.finditer(r'async\s+function|async\s+\w+\s*\(', content):
                    line = content[:m.start()].count('\n') + 1
                    # Check if this async function has try/catch nearby
                    snippet = content[m.start():m.start() + 500]
                    if 'try' not in snippet and '.catch(' not in snippet:
                        self.issues["框架规范"].append({
                            "file": str(relpath), "line": line,
                            "desc": "异步函数缺少 try/catch 错误处理",
                            "severity": SEV_HIGH,
                            "suggestion": "添加 try/catch 或使用 express-async-errors"
                        })

    # ── Security checks ──────────────────────────────────────────

    def _check_security(self, content, relpath):
        # Dangerous functions
        dangerous = [
            (r'\beval\s*\(', "使用了 eval()，存在代码注入风险"),
            (r'new\s+Function\s*\(', "使用了 new Function()，存在代码注入风险"),
            (r'\.innerHTML\s*=', "使用了 innerHTML，可能导致 XSS 攻击"),
            (r'document\.write\s*\(', "使用了 document.write()，存在 XSS 风险"),
        ]
        for pattern, desc in dangerous:
            for m in re.finditer(pattern, content):
                line = content[:m.start()].count('\n') + 1
                self.issues["安全规范"].append({
                    "file": str(relpath), "line": line,
                    "desc": desc,
                    "severity": SEV_HIGH,
                    "suggestion": "使用安全的替代 API（如 textContent、DOMPurify）"
                })

        # Hardcoded secrets
        secret_patterns = [
            (r'(?i)(password|passwd|pwd)\s*[:=]\s*["\'][^"\']+["\']', "疑似硬编码密码"),
            (r'(?i)(api[_-]?key|apikey)\s*[:=]\s*["\'][^"\']+["\']', "疑似硬编码 API Key"),
            (r'(?i)(secret|token)\s*[:=]\s*["\'][^"\']{8,}["\']', "疑似硬编码 Secret/Token"),
        ]
        for pattern, desc in secret_patterns:
            for m in re.finditer(pattern, content):
                line = content[:m.start()].count('\n') + 1
                self.issues["安全规范"].append({
                    "file": str(relpath), "line": line,
                    "desc": desc,
                    "severity": SEV_HIGH,
                    "suggestion": "使用环境变量或密钥管理服务存储敏感信息"
                })

        # console.log with sensitive data
        if str(relpath).endswith('.js'):
            for m in re.finditer(r'console\.(log|dir|info)\s*\(\s*(password|token|secret|key|auth)', content, re.IGNORECASE):
                line = content[:m.start()].count('\n') + 1
                self.issues["安全规范"].append({
                    "file": str(relpath), "line": line,
                    "desc": "在日志中输出敏感信息",
                    "severity": SEV_HIGH,
                    "suggestion": "移除或脱敏日志中的敏感数据"
                })

    # ── Performance checks ────────────────────────────────────────

    def _check_performance(self, content, relpath, suffix):
        # Large component detection
        if suffix in ('.jsx', '.tsx'):
            lines = content.split('\n')
            # Check for huge return blocks in components
            for m in re.finditer(r'return\s*\(', content):
                start = m.start()
                end_pos = content.find('\n);', start)
                if end_pos > start:
                    component_lines = content[start:end_pos].count('\n')
                    if component_lines > 200:
                        line = content[:start].count('\n') + 1
                        self.issues["性能规范"].append({
                            "file": str(relpath), "line": line,
                            "desc": f"组件渲染块过长（{component_lines} 行），应考虑拆分",
                            "severity": SEV_MED,
                            "suggestion": "将大组件拆分为多个小组件"
                        })
                    break

        # Inline function in render (causing re-renders)
        if suffix in ('.jsx', '.tsx'):
            # Check for arrow functions in JSX props
            for m in re.finditer(r'onClick\s*=\s*\{\(\)\s*=>', content):
                line = content[:m.start()].count('\n') + 1
                self.issues["性能规范"].append({
                    "file": str(relpath), "line": line,
                    "desc": "JSX 中使用了内联箭头函数，导致每次渲染创建新函数",
                    "severity": SEV_MED,
                    "suggestion": "提取为组件方法或用 useCallback 包裹"
                })

            # Check for inline objects in JSX props
            for m in re.finditer(r'style\s*=\s*\{\{', content):
                line = content[:m.start()].count('\n') + 1
                self.issues["性能规范"].append({
                    "file": str(relpath), "line": line,
                    "desc": "JSX 中使用了内联 style 对象，导致每次渲染创建新对象",
                    "severity": SEV_LOW,
                    "suggestion": "将 style 对象提取到组件外部或使用 className"
                })

        # Check for missing useEffect cleanup
        if suffix in ('.js', '.jsx', '.tsx'):
            for m in re.finditer(r'useEffect\s*\(\s*\(\)\s*=>\s*\{', content):
                start = m.start()
                # Find the matching closing brace
                end = self._find_matching_brace(content, start)
                snippet = content[start:end]
                # Check for subscriptions/intervals without cleanup
                if re.search(r'(setInterval|addEventListener|subscribe|\.on\()', snippet):
                    if 'return' not in snippet.split('=>')[1] if '=>' in snippet else True:
                        if 'clearInterval' not in snippet and 'removeEventListener' not in snippet and '.off' not in snippet:
                            line = content[:start].count('\n') + 1
                            self.issues["性能规范"].append({
                                "file": str(relpath), "line": line,
                                "desc": "useEffect 中有订阅/定时器但缺少清理函数，可能导致内存泄漏",
                                "severity": SEV_HIGH,
                                "suggestion": "在 useEffect 中返回清理函数清理副作用"
                            })

    # ── Naming checks ────────────────────────────────────────────

    def _check_naming(self, content, relpath, suffix):
        # Check function naming: functions should be camelCase
        for m in re.finditer(r'(?:function|const)\s+(\w+)\s*(?:[=(]|\s*:)', content):
            name = m.group(1)
            line = content[:m.start()].count('\n') + 1
            # Check for snake_case in JS/TS
            if re.match(r'^[a-z]+_[a-z]', name) and not name.startswith('__'):
                self.issues["命名与结构"].append({
                    "file": str(relpath), "line": line,
                    "desc": f"函数/变量名 '{name}' 使用了蛇形命名，应使用驼峰命名",
                    "severity": SEV_MED,
                    "suggestion": f"将 '{name}' 改为驼峰命名"
                })

        # Check component naming: React components should be PascalCase
        if suffix in ('.jsx', '.tsx'):
            # Identify React components by looking for JSX element returns
            component_rx = re.compile(
                r'(?:function|const)\s+([a-z]\w*)\s*'
                r'(?:=\s*(?:\([^)]*\)|[^(]*)\s*=>|\([^)]*\))'
            )
            for m in component_rx.finditer(content):
                name = m.group(1)
                if name in ('default', 'exports'):
                    continue
                line = content[:m.start()].count('\n') + 1
                # Find the function body between matching braces
                body_start = content.find('{', m.end())
                if body_start > 0:
                    body_end = self._find_matching_brace(content, body_start)
                    body_text = content[body_start:body_end]
                    # Check for JSX return within the function body only
                    if re.search(r'return\s+<', body_text) or re.search(r'return\s*\(\s*<\w+', body_text):
                        self.issues["命名与结构"].append({
                            "file": str(relpath), "line": line,
                            "desc": f"React 组件 '{name}' 应以大写字母开头（PascalCase）",
                            "severity": SEV_MED,
                            "suggestion": f"将 '{name}' 重命名为首字母大写的组件名"
                        })

        # Check file naming convention
        filename = relpath.name
        if suffix in ('.jsx', '.tsx') and filename[0].islower():
            self.issues["命名与结构"].append({
                "file": str(relpath), "line": 1,
                "desc": f"组件文件 '{filename}' 应以大写字母开头，与组件名保持一致",
                "severity": SEV_LOW,
                "suggestion": f"将文件重命名为 '{filename[0].upper() + filename[1:]}'"
            })

    # ── Helpers ──────────────────────────────────────────────────

    def _find_line(self, content, pattern):
        m = re.search(pattern, content)
        if m:
            return content[:m.start()].count('\n') + 1
        return 1

    def _find_matching_brace(self, content, start):
        """Find the matching closing brace from position."""
        brace_start = content.find('{', start)
        if brace_start == -1:
            return len(content)
        count = 0
        for i in range(brace_start, len(content)):
            if content[i] == '{':
                count += 1
            elif content[i] == '}':
                count -= 1
                if count == 0:
                    return i + 1
        return len(content)


def run_eslint(path):
    """Run ESLint if available."""
    try:
        result = subprocess.run(
            ['npx', 'eslint', '.', '-f', 'json', '--max-warnings', '0'],
            cwd=path,
            capture_output=True,
            text=True,
            timeout=60
        )
        if result.stdout:
            return json.loads(result.stdout)
    except (subprocess.TimeoutExpired, FileNotFoundError, json.JSONDecodeError):
        pass
    return None


def generate_report(checker, eslint_results=None):
    """Generate the final Markdown report."""
    now = datetime.now().strftime('%Y-%m-%d %H:%M')
    issues = dict(checker.issues)
    total_issues = sum(len(v) for v in issues.values())

    # Determine overall status
    high_count = sum(1 for v in issues.values() for i in v if "🔴" in i["severity"])
    if high_count > 0:
        overall = "❌ Fail (存在高危问题)"
    elif total_issues > 0:
        overall = "⚠️ Warnings (需改进)"
    else:
        overall = "✅ Pass (完全符合规范)"

    lines = []
    lines.append("# Code Standards Check Report\n")
    lines.append(f"**Date**: {now}")
    lines.append(f"**Scope**: {checker.file_count} source files checked")
    lines.append(f"**Overall**: {overall}\n")

    category_order = ["代码格式", "框架规范", "安全规范", "性能规范", "命名与结构"]
    category_labels = {
        "代码格式": "1. 代码格式 (Code Formatting)",
        "框架规范": "2. 框架规范 (Framework Best Practices)",
        "安全规范": "3. 安全规范 (Security)",
        "性能规范": "4. 性能规范 (Performance)",
        "命名与结构": "5. 命名与结构 (Naming & Structure)",
    }

    for key in category_order:
        label = category_labels[key]
        items = issues.get(key, [])
        lines.append(f"---\n\n## {label}")
        if not items:
            lines.append("\n✅ No issues found\n")
            continue

        for item in items:
            sev = item["severity"]
            desc = item["desc"]
            fpath = item["file"]
            lnum = item["line"]
            suggestion = item["suggestion"]
            lines.append(f"\n- **{fpath}:{lnum}** — {sev}")
            lines.append(f"  - {desc}")
            lines.append(f"  - 💡 *建议*: {suggestion}")

    # Summary table
    lines.append(f"\n---\n\n## Summary\n")
    lines.append("| Category | Issues Found | High | Med | Low |")
    lines.append("|---|---|---|---|---|")
    for key in category_order:
        items = issues.get(key, [])
        total = len(items)
        high = sum(1 for i in items if "🔴" in i["severity"])
        med = sum(1 for i in items if "🟡" in i["severity"])
        low = sum(1 for i in items if "🟢" in i["severity"])
        lines.append(f"| {key} | {total} | {high} | {med} | {low} |")

    lines.append(f"\n**Total Issues: {total_issues}**\n")

    # Recommendations
    lines.append("### Recommendations\n")
    priority_items = sorted(
        [(i, k) for k, v in issues.items() for i in v if "🔴" in i["severity"]],
        key=lambda x: x[0]["file"]
    )
    if priority_items:
        lines.append("**🔴 Priority fixes:**")
        for item, cat in priority_items:
            lines.append(f"- `{item['file']}:{item['line']}` — {item['desc']}")
    else:
        lines.append("✅ No critical issues found. Continue maintaining good practices!")

    return '\n'.join(lines)


def main():
    import argparse
    parser = argparse.ArgumentParser(description='Run code standards checks')
    parser.add_argument('--path', default='.', help='Target directory to check')
    parser.add_argument('--output', '-o', help='Output file for the report')
    parser.add_argument('--files', nargs='*', help='Specific files to check (relative to path)')
    args = parser.parse_args()

    checker = CodeChecker(args.path)

    if args.files:
        files = [Path(args.path) / f for f in args.files]
    else:
        files = None

    checker.check(files)

    report = generate_report(checker)

    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"Report written to {args.output}")
    else:
        print(report)


if __name__ == '__main__':
    main()
