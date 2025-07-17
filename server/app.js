const express = require("express")
const cors = require("cors")
const http = require("http")
//自己组件项目不能自己依赖自己
const logger = require("./lib/logger")
const errorHandler = require("./lib/errorHandler")
const jobsRouter = require("./routes/jobs")
const bossRouter = require("./routes/boss")
const booksRouter = require("./routes/books")
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

app.use("/api/books", booksRouter)
app.use("/jobs", jobsRouter)
app.use("/bosses", bossRouter)
app.get("/", (req, res) => {
  res.send(`
    <h1>任务管理系统</h1>
    <p>可用端点:</p>
    <ul>
      <li>GET /jobs - 获取所有任务</li>
      <li>POST /jobs - 创建新任务</li>
      <li>PUT /jobs/:id - 更新任务</li>
    </ul>
  `)
})

app.use((req, res) => {
  res.status(404).send("404 - 页面未找到")
})

app.use(errorHandler({ debug: true }))

const server = http.createServer(app)

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
