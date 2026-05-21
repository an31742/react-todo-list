---
name: code-standards-checker
description: Automatically review code for standards compliance and generate structured reports. Use this skill when the user asks you to check code quality, review code standards, run linting, check for best practices, perform code review focused on standards, or generate a code quality report. This covers formatting conventions, React/Node.js best practices, security patterns, performance anti-patterns, and naming consistency. Make sure to use this skill whenever the user requests a "code review", "standards check", "code quality check", "lint review", or "规范检查" — even if they only ask in passing or as part of a broader request.
---

# Code Standards Checker

Review code files for compliance with coding standards and generate a structured Markdown report. This skill is designed to run during code review workflows, catching issues before they reach production.

## Overview

The checker evaluates code across five dimensions:

1. **代码格式** — Indentation, quotes, semicolons, whitespace, line length
2. **框架规范** — React hooks rules, JSX conventions, component structure, Node.js route/error-handling patterns
3. **安全规范** — XSS, injection, hardcoded secrets, missing input validation
4. **性能规范** — Unnecessary re-renders, large components, expensive computations
5. **命名与结构** — Naming consistency (camelCase/PascalCase), file organization, exports

## Workflow: Run Standards Check

When triggered, follow these steps in order:

### Step 1: Determine scope

Identify which files to check:
- If reviewing a PR/branch: `git diff --name-only main...HEAD` to get changed files
- If checking specific files: use the files the user specified
- If checking the whole project: scan all source files (exclude `node_modules`, `build`, `.git`)

Filter to relevant source files: `.js`, `.jsx`, `.ts`, `.tsx`, `.css`, `.json` (config only).

### Step 2: Run automated checks

Use the helper scripts in `scripts/`:

```bash
# Run all checks and produce report
python3 scripts/run_all_checks.py --path <target-path> > report.md
```

The script will analyze:
- ESLint violations (if `.eslintrc` config exists)
- Common pattern violations (inline styles, missing error handling, etc.)
- Security anti-patterns
- Performance anti-patterns
- Naming convention violations

### Step 3: Manual review pass

After automated checks, do a manual pass on flagged files for issues automated tools miss:

- **React**: Check hooks dependencies, component re-render triggers, prop drilling
- **Node**: Check error handling in async routes, input sanitization, proper status codes
- **Security**: Check for console.log with sensitive data, eval usage, innerHTML
- **Performance**: Check for large useEffect dependencies, unnecessary state, expensive renders

### Step 4: Generate report

Output a Markdown report with this structure:

````markdown
# Code Standards Check Report

**Project**: <name>
**Date**: <date>
**Scope**: <files checked>
**Overall**: ✅ Pass / ⚠️ Warnings / ❌ Fail

---

## 1. 代码格式 (Code Formatting)
<issues or "✅ No issues found">

## 2. 框架规范 (Framework Best Practices)
<issues or "✅ No issues found">

## 3. 安全规范 (Security)
<issues or "✅ No issues found">

## 4. 性能规范 (Performance)
<issues or "✅ No issues found">

## 5. 命名与结构 (Naming & Structure)
<issues or "✅ No issues found">

---

## Summary

| Category | Issues Found | Severity |
|---|---|---|
| 代码格式 | N | Low/Medium/High |
| ... | ... | ... |

**Recommendations**:
- Priority fixes
- Suggested improvements
````

Each issue entry should include:
- File path with line number reference
- Issue description in Chinese
- Severity: 🔴 High / 🟡 Medium / 🟢 Low
- Suggestion for fix

## Reference Files

- `references/standards.md` — Detailed coding standards reference (loaded on demand for specific rule lookups)
- `scripts/run_all_checks.py` — Automated checker script
- `evals/evals.json` — Test cases

## Standards Reference Categories

When writing the report, use these standard categories with Chinese labels:

### Code Formatting
- Use 2-space indentation
- Single quotes for strings (JS/JSX)
- Semicolons required
- Trailing commas where valid
- Max 100 chars per line

### React/JSX
- Use functional components with hooks
- Hooks must follow Rules of Hooks (top-level, same order)
- useEffect deps must be exhaustive
- Prop types should be validated (TypeScript preferred)
- No direct DOM manipulation
- Keys in lists must be stable and unique

### Node.js
- Async handlers must have try/catch with next(error)
- Route handlers should use express-async-errors or explicit error forwarding
- Environment variables accessed via config module, not process.env directly
- Database queries must use parameterized queries
- Consistent response format: `{ success, data, message, error }`

### Security
- No hardcoded secrets (API keys, passwords, tokens)
- No dangerous functions: `eval()`, `Function()`, `innerHTML`
- User input must be validated/sanitized
- HTTP-only cookies for auth tokens
- Rate limiting on auth endpoints

### Performance
- Avoid inline object/function in render (memoization)
- Large lists should be virtualized
- Bundle size awareness — avoid large libraries
- useEffect cleanup for subscriptions/event listeners

### Naming
- camelCase for variables, functions, instances
- PascalCase for components, classes, types
- UPPER_SNAKE_CASE for constants
- File name matches default export name
- Boolean vars: `is*`, `has*`, `should*` prefix

## Important Guidelines

- Always check if `node_modules` or `build` directories exist before scanning and exclude them
- For large codebases, focus on changed files (diff) rather than the whole project
- Use the `scripts/run_all_checks.py` script as the primary automation tool — it handles the heavy lifting
- Don't modify source files during the check — only read and report
- If ESLint config exists in the project, run ESLint programmatically and incorporate results
- When checking security, prioritize OWASP Top 10 issues
