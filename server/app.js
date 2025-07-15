const express = require("express")
const cors = require("cors")
const http = require("http")
//自己组件项目不能自己依赖自己
const logger = require("./lib/logger")
const errorHandler = require("./lib/errorHandler")
const jobHandler = require("./job")
const bossHandler = require("./data/boss/interfaceBoss")
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

// 路由配置
app.get("/jobs", async (req, res) => {
  try {
    const jobs = jobHandler.getAllJobs()
    res.setHeader("Content-Type", "application/json")
    res.status(200).json(jobs)
  } catch (error) {
    console.error(`获取任务错误: ${error}`)
    res.status(500).json({ error: "服务器内部错误，无法获取任务数据" })
  }
})

app.post("/add/jobs", (req, res) => {
  const newJob = req.body
  const createdJob = jobHandler.createJob(newJob)
  res.status(201).json(createdJob)
})

app.put("/jobs/:id", (req, res) => {
  const jobId = req.params.id
  const updatedData = req.body
  const updatedJob = jobHandler.updateJob(jobId, updatedData)

  if (updatedJob) {
    res.json(updatedJob)
  } else {
    res.status(404).json({ error: "任务未找到" })
  }
})

//获取数据boss
app.get("/bosses", (req, res) => {
  try {
    const bosses = bossHandler.getAllBosses()
    res.setHeader("Content-Type", "application/json")
    res.status(200).json(bosses)
  } catch (error) {
    console.error(`${error}获取任务错误`)
    res.status(500).json({ error: "服务器内部错误" })
  }
})

app.post("/add/boss", (req, res) => {
  const newBoss = req.body
  const creatBoss = bossHandler.createBoss(newBoss)
  res.status(200).json(creatBoss)
})

app.put("/updateBoss/:id", (req, res) => {
  const id = req.params.id
  const data = req.body
  const updateBoss = bossHandler.updateBoss(id, data)
  res.status(200).json(updateBoss)
})
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id
  const removeBoss = bossHandler.removeBoss(id)
  res.status(200).json(removeBoss)
})

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
  if (typeof jobHandler.initializeJobs === "function") {
    jobHandler.initializeJobs()
  }
})

process.on("SIGINT", () => {
  console.log("\n服务器正在关闭...")
  if (typeof jobHandler.saveJobsToFile === "function") {
    jobHandler.saveJobsToFile()
  }
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
