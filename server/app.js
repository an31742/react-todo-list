require('dotenv').config()
const socketIo = require('socket.io');
const express = require("express")
const cors = require("cors")
const http = require("http")
//自己组件项目不能自己依赖自己
const logger = require("./lib/logger")
const errorHandler = require("./lib/errorHandler")
const booksRouter = require("./routes/books")
const todosRouter = require("./routes/todos")
const authRouter = require("./routes/auth")
const uploadRouter = require("./routes/upload")
const tasksRouter = require("./routes/tasks")
//引入curd 导入mongodb

const app = express()
const port = process.env.PORT || 8899

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:3000']
  : ['http://localhost:3000']

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 静态文件服务
app.use('/uploads', express.static('uploads'))

app.use(
  logger({
    logDir: "./test-logs",
    format: ":method :url :status - :response-time ms",
  })
)

// API路由
app.use("/api/auth", authRouter)
app.use("/api/upload", uploadRouter)
app.use("/api/todos", todosRouter)
app.use("/api/tasks", tasksRouter)
app.use("/api/books", booksRouter)

app.get("/", (req, res) => {
  res.send(`
    <h1>React Todo 全栈学习项目</h1>
    <p>可用端点:</p>
    <ul>
      <li><strong>认证相关:</strong></li>
      <li>POST /api/auth/register - 用户注册</li>
      <li>POST /api/auth/login - 用户登录</li>
      <li>GET /api/auth/profile - 获取用户信息</li>
      <li><strong>Todo相关:</strong></li>
      <li>GET /api/todos - 获取所有todos</li>
      <li>POST /api/todos - 创建新todo</li>
      <li>PUT /api/todos/:id - 更新todo</li>
      <li>DELETE /api/todos/:id - 删除todo</li>
      <li><strong>其他功能:</strong></li>
      <li>GET /api/books - 图书管理</li>
    </ul>
  `)
})
app.use((req, res) => {
  res.status(404).send("404 - 页面未找到")
})

app.use(errorHandler({ debug: true }))

const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
})

const onlineUsers = new Map()
io.on('connection', (socket) => {
  console.log('用户连接:', socket.id)

  socket.on('joinProject', (userData) => {
    onlineUsers.set(socket.id, userData)
    io.emit('usersOnline', Array.from(onlineUsers.values()))
  })

  socket.on('taskUpdate', (taskData) => {
    socket.broadcast.emit('taskUpdated', {
      id: taskData.id,
      title: taskData.title,
      action: taskData.action,
      status: taskData.status,
      updatedBy: 'Current User'
    })
  })

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id)
    io.emit('usersOnline', Array.from(onlineUsers.values()))
  })
})

// 本地开发时启动监听，Vercel Serverless 环境下导出 app
if (process.env.VERCEL) {
  module.exports = app
} else {
  server.listen(port, () => {
    console.log(`服务器正在运行，访问地址: http://localhost:${port}`)
  })

  process.on('SIGINT', () => {
    server.close(() => process.exit())
  })

  process.on('uncaughtException', (err) => {
    console.error('未捕获的异常:', err.stack)
    process.exit(1)
  })

  process.on('unhandledRejection', (reason) => {
    console.error('未处理的 Promise 拒绝:', reason)
  })
}

module.exports = app
