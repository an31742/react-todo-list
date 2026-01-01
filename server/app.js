require('dotenv').config()
const socketIo = require('socket.io');
const express = require("express")
const cors = require("cors")
const http = require("http")
//自己组件项目不能自己依赖自己
const logger = require("./lib/logger")
const errorHandler = require("./lib/errorHandler")
const jobsRouter = require("./routes/jobs")
const bossRouter = require("./routes/boss")
const booksRouter = require("./routes/books")
const todosRouter = require("./routes/todos")
const authRouter = require("./routes/auth")
const tasksRouter = require("./routes/tasks")
//引入curd 导入mongodb

const app = express()
const port = process.env.PORT || 8899

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  logger({
    logDir: "./test-logs",
    format: ":method :url :status - :response-time ms",
  })
)

// API路由
app.use("/api/auth", authRouter)
app.use("/api/todos", todosRouter)
app.use("/api/tasks", tasksRouter)
app.use("/api/books", booksRouter)
app.use("/jobs", jobsRouter)
app.use("/bosses", bossRouter)

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
      <li>GET /jobs - 职位信息</li>
    </ul>
  `)
})
app.use((req, res) => {
  res.status(404).send("404 - 页面未找到")
})

app.use(errorHandler({ debug: true }))

const server = http.createServer(app)
const io=socketIo(server,{
  cors:{
    origin:'http://localhost:3000',
    methods:['GET','POST']
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
    console.log('任务更新:', taskData);
    // 广播给其他用户
    socket.broadcast.emit('taskUpdated', {
      id: taskData.id,
      title: taskData.title,
      action: taskData.action,
      status: taskData.status,
      updatedBy: 'Current User'
    });
  })
  
  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id)
    io.emit('usersOnline', Array.from(onlineUsers.values()))
  })
})




server.listen(port, () => {
  console.log(`服务器正在运行，访问地址: http://localhost:${port}`)
  console.log(`任务系统已初始化`)
})

process.on("SIGINT", () => {
  console.log("\n服务器正在关闭...")

  server.close(() => {
    console.log("服务器已关闭。")
    process.exit()
  })
})

process.on("uncaughtException", (err) => {
  console.error("未捕获的异常:", err.stack)
  process.exit(1)
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("未处理的 Promise 拒绝:", reason)
})
