module.exports = (options = {}) => {
  const defaults = {
    debug: false,
    logErrors: true,
  }
  const config = { ...defaults, ...options }
  return (err, req, res, next) => {
    // 默认错误响应
    const statusCode = err.statusCode || 500
    const message = statusCode === 500 ? "Internal Server Error" : err.message

    // 如果配置了日志记录错误，则输出错误信息
    const response = config.debug ? { error: message, details: err.stack } : { error: message }
    //记录错误日志
    if (config.logErrors) {
      console.error(`[ERROR] ${statusCode} ${req.method} ${req.url}:`)
      console.error(err.stack)
    }
    res.status(statusCode).json(response)
  }
}
