const fs = require("fs")
const path = require("path")

module.exports = (options = {}) => {
  const defaults = {
    logDir: "./logs",
    fileName: "access.log",
    format: ":method :url :status - :response-time ms",
  }
  const config = { ...defaults, ...options }
  const isVercel = !!process.env.VERCEL

  let logStream = null
  if (!isVercel) {
    if (!fs.existsSync(config.logDir)) {
      fs.mkdirSync(config.logDir, { recursive: true })
    }
    logStream = fs.createWriteStream(
      path.join(config.logDir, config.fileName),
      { flags: "a" }
    )
  }

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
