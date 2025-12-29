require('dotenv').config()
const express = require("express")
const cors = require("cors")

const app = express()
const port = process.env.PORT || 8899

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 基础路由
app.get("/", (req, res) => {
  res.json({
    message: "React Todo 全栈学习项目",
    status: "running",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login"
      },
      todos: {
        list: "GET /api/todos",
        create: "POST /api/todos",
        update: "PUT /api/todos/:id",
        delete: "DELETE /api/todos/:id"
      }
    }
  })
})

// 简单的认证路由
app.post("/api/auth/register", (req, res) => {
  const { username, email, password } = req.body
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: "所有字段都是必需的" })
  }
  
  res.json({
    message: "注册成功",
    user: { username, email },
    token: "demo-token-" + Date.now()
  })
})

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body
  
  if (!email || !password) {
    return res.status(400).json({ error: "邮箱和密码都是必需的" })
  }
  
  res.json({
    message: "登录成功",
    user: { email },
    token: "demo-token-" + Date.now()
  })
})

// 简单的todos路由
let todos = [
  { id: 1, title: "学习React", completed: false, createdAt: new Date() },
  { id: 2, title: "学习Node.js", completed: false, createdAt: new Date() }
]

app.get("/api/todos", (req, res) => {
  res.json({ todos, total: todos.length })
})

app.post("/api/todos", (req, res) => {
  const { title, description } = req.body
  
  if (!title) {
    return res.status(400).json({ error: "标题是必需的" })
  }
  
  const newTodo = {
    id: todos.length + 1,
    title,
    description: description || "",
    completed: false,
    createdAt: new Date()
  }
  
  todos.push(newTodo)
  res.status(201).json(newTodo)
})

app.put("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const todoIndex = todos.findIndex(todo => todo.id === id)
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo未找到" })
  }
  
  todos[todoIndex] = { ...todos[todoIndex], ...req.body, updatedAt: new Date() }
  res.json(todos[todoIndex])
})

app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const todoIndex = todos.findIndex(todo => todo.id === id)
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo未找到" })
  }
  
  todos.splice(todoIndex, 1)
  res.json({ message: "Todo删除成功" })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: "接口未找到" })
})

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "服务器内部错误" })
})

app.listen(port, () => {
  console.log(`🚀 服务器启动成功！`)
  console.log(`📍 访问地址: http://localhost:${port}`)
  console.log(`📚 API文档: http://localhost:${port}`)
})

process.on("SIGINT", () => {
  console.log("\n👋 服务器正在关闭...")
  process.exit(0)
})