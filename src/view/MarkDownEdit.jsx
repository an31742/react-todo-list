// src/App.js
import React, { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism"
import "../components/markDown/markDown.css" // 引入样式文件

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(`# 欢迎使用Markdown编辑器

## 功能特性
- **实时预览** - 编辑时即时查看渲染结果
- **语法高亮** - 代码块自动高亮显示
- **工具栏支持** - 快速插入常用格式
- **导出功能** - 支持导出为Markdown或HTML
- **主题切换** - 亮色/暗黑模式自由切换

## 示例代码
\`\`\`javascript
function helloWorld() {
  console.log('Hello, Markdown Editor!');
  return (
    <div className="app">
      <h1>React Markdown Editor</h1>
      <p>这是一个功能强大的编辑器</p>
    </div>
  );
}
\`\`\`

## 表格示例
| 功能       | 状态    | 说明                |
|------------|---------|---------------------|
| 实时预览   | ✅ 支持 | 编辑时即时渲染      |
| 导出HTML   | ✅ 支持 | 导出完整HTML文件    |
| 暗黑模式   | ✅ 支持 | 护眼夜间模式        |
| 响应式设计 | ✅ 支持 | 适配各种屏幕尺寸    |

> 提示：您可以使用工具栏按钮或直接输入Markdown语法
`)

  const [isDarkMode, setIsDarkMode] = useState(false)
  const editorRef = useRef(null)
  const previewRef = useRef(null)

  // 同步滚动
  const handleEditorScroll = (e) => {
    if (!previewRef.current) return

    const editor = e.target
    const preview = previewRef.current

    const editorScrollPercent = editor.scrollTop / (editor.scrollHeight - editor.clientHeight)
    const previewScrollTop = editorScrollPercent * (preview.scrollHeight - preview.clientHeight)

    preview.scrollTop = previewScrollTop
  }

  // 插入文本
  const insertText = (syntax, offset = 0) => {
    const editor = editorRef.current
    if (!editor) return

    const start = editor.selectionStart
    const end = editor.selectionEnd
    const selectedText = markdown.substring(start, end)
    const before = markdown.substring(0, start)
    const after = markdown.substring(end)

    let newText
    if (syntax.includes("$SELECTION")) {
      newText = syntax.replace("$SELECTION", selectedText)
    } else {
      newText = syntax + selectedText
    }

    const newMarkdown = before + newText + after
    setMarkdown(newMarkdown)

    // 设置光标位置
    setTimeout(() => {
      editor.focus()
      const newCursorPos = start + newText.length + offset
      editor.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  // 导出Markdown文件
  const exportAsMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "markdown-editor-export.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 导出HTML文件
  const exportAsHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown导出</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
      background-color: #fff;
    }
    pre {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 15px;
      border-radius: 5px;
      overflow: auto;
    }
    code {
      background: #f5f5f5;
      padding: 2px 5px;
      border-radius: 3px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 15px;
      color: #666;
      margin-left: 0;
    }
    img {
      max-width: 100%;
    }
    h1, h2, h3 {
      border-bottom: 1px solid #eee;
      padding-bottom: 0.3em;
    }
  </style>
</head>
<body>
  <div id="exported-content">
    <ReactMarkdown
      children={${JSON.stringify(markdown)}}
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    />
  </div>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "markdown-export.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 切换主题
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    localStorage.setItem("darkMode", !isDarkMode)
  }

  // 检查本地存储的主题设置
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setIsDarkMode(savedDarkMode)
  }, [])

  return (
    <div className={`markdown-editor-container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="header">
        <div className="logo">
          <div className="logo-icon">MD</div>
          <h1>React Markdown 编辑器</h1>
        </div>
        <div className="actions">
          <button onClick={toggleDarkMode} className="action-btn">
            <i className={`icon ${isDarkMode ? "icon-sun" : "icon-moon"}`}></i>
            {isDarkMode ? "亮色模式" : "暗黑模式"}
          </button>
          <button onClick={exportAsMarkdown} className="action-btn">
            <i className="icon icon-download"></i> 导出MD
          </button>
          <button onClick={exportAsHTML} className="action-btn primary">
            <i className="icon icon-html"></i> 导出HTML
          </button>
        </div>
      </div>

      <div className="toolbar">
        <button onClick={() => insertText("# ")} title="标题1">
          <i className="icon icon-h1">H1</i>
        </button>
        <button onClick={() => insertText("## ")} title="标题2">
          <i className="icon icon-h2">H2</i>
        </button>
        <button onClick={() => insertText("### ")} title="标题3">
          <i className="icon icon-h3">H3</i>
        </button>
        <div className="divider"></div>
        <button onClick={() => insertText("**$SELECTION**", 2)} title="加粗">
          <i className="icon icon-bold">B</i>
        </button>
        <button onClick={() => insertText("*$SELECTION*", 1)} title="斜体">
          <i className="icon icon-italic">I</i>
        </button>
        <button onClick={() => insertText("~~$SELECTION~~", 2)} title="删除线">
          <i className="icon icon-strikethrough">S</i>
        </button>
        <div className="divider"></div>
        <button onClick={() => insertText("[链接文字](https://)", 1)} title="链接">
          <i className="icon icon-link">🔗</i>
        </button>
        <button onClick={() => insertText("![描述](图片地址)", 2)} title="图片">
          <i className="icon icon-image">🖼️</i>
        </button>
        <div className="divider"></div>
        <button onClick={() => insertText("> ")} title="引用">
          <i className="icon icon-quote">❝</i>
        </button>
        <button onClick={() => insertText("- ")} title="无序列表">
          <i className="icon icon-list">•</i>
        </button>
        <button onClick={() => insertText("1. ")} title="有序列表">
          <i className="icon icon-olist">1.</i>
        </button>
        <div className="divider"></div>
        <button onClick={() => insertText("```\n\n```", 4)} title="代码块">
          <i className="icon icon-code">{"</>"}</i>
        </button>
        <button onClick={() => insertText("| 标题 | 标题 |\n|------|------|\n| 内容 | 内容 |")} title="表格">
          <i className="icon icon-table">⊞</i>
        </button>
        <button onClick={() => insertText("---\n")} title="分隔线">
          <i className="icon icon-hr">—</i>
        </button>
      </div>

      <div className="editor-preview">
        <div className="editor-container">
          <div className="panel-header">
            <i className="icon icon-edit"></i>
            <span>编辑区</span>
          </div>
          <textarea ref={editorRef} id="editor" value={markdown} onChange={(e) => setMarkdown(e.target.value)} onScroll={handleEditorScroll} placeholder="在此输入Markdown文本..." />
        </div>
        <div className="preview-container">
          <div className="panel-header">
            <i className="icon icon-preview"></i>
            <span>预览区</span>
          </div>
          <div ref={previewRef} id="preview" className="markdown-preview">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "")
                  return !inline && match ? (
                    <SyntaxHighlighter style={isDarkMode ? vscDarkPlus : vs} language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="footer">
        <p>使用React和react-markdown构建 | 支持GitHub风格的Markdown语法</p>
        <div className="stats">
          <span>字数: {markdown.length}</span>
          <span>行数: {markdown.split("\n").length}</span>
        </div>
      </div>
    </div>
  )
}

export default MarkdownEditor
