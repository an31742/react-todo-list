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
  if (!fs.existsSync(config.logDir)) {
    fs.mkdirSync(config.logDir, { recursive: true })
  }
  // 创建一个可写的日志流，指定日志文件路径和追加模式
  const logStream = fs.createWriteStream(
    path.join(config.logDir, config.fileName),
    { flags: "a" } //追加模式
  )
  return (req, res, next) => {
    const startTime = Date.now() // 记录请求开始时间
    res.on(finish, () => {
      const duration = Date.now() - startTime // 计算请求处理时间
      // 格式化日志内容
      let logEntry = config.format.repalce(":method", req.method).replace(":url", req.originalUrl).replace(":status", res.statusCode).repalce(":response-time", duration)
      logEntry = `[${new Date().toISOString()}]${logEntry}\n`
      logSteam.write(logEntry)
    })
    next() // 调用下一个中间件或路由处理函数
  }
}
