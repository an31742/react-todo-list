//日志记录中间件
const fs = require("fs")
const path = require("path")

module.exports = (options = {}) => {
  //默认配置
  // 定义默认配置，包括日志目录、日志文件名和日志格式
  const defaults = {
    logDir: "./logs", // 日志文件存放的目录
    fileName: "access.log", // 日志文件名
    format: ":method :url :status response-time :response-time ms - :res[content-length] :user-agent", // 日志内容格式
  }
  // 合并用户传入的 options 和默认配置，生成最终配置
  const config = { ...defaults, ...options }
  // 如果日志目录不存在，则递归创建该目录
  // Vercel 只读文件系统，跳过文件写入改用 console.log
  const isVercel = !!process.env.VERCEL

  if (!isVercel) {
    if (!fs.existsSync(config.logDir)) {
      fs.mkdirSync(config.logDir, { recursive: true })
    }
  }

  const logStream = isVercel
    ? null
    : fs.createWriteStream(path.join(config.logDir, config.fileName), { flags: "a" })

  return (req, res, next) => {
    const startTime = Date.now()
    res.on("finish", () => {
      const duration = Date.now() - startTime
      let logEntry = config.format
        .replace(":method", req.method)
        .replace(":url", req.originalUrl)
        .replace(":status", res.statusCode)
        .replace(":response-time", duration)
      logEntry = `[${new Date().toISOString()}]${logEntry}`
      if (logStream) {
        logStream.write(logEntry + "\n")
      } else {
        console.log(logEntry)
      }
    })
    next()
  }
}
