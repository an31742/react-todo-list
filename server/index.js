//引入核心模块
const http = require("http")
const fs = require("fs")
//定义端口号
const port = 8899
const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors()) // 允许所有跨域
//提供数据文件
const dataFile = "jobs.json"

// 4. 使用 http.createServer() 创建服务器实例
// 它接收一个回调函数，每次有请求到来时都会执行

const server = http.createServer((req, res) => {
  // 5. 打印请求的 URL 到控制台，方便调试
  console.log(`收到请求: ${req.url}`)
  // 6. 设置响应头，指定内容类型为 JSON

  // 注意：req.url 包含斜杠，应该判断为 "/jobs"
  if (req.url === "/jobs") {
    // 7. 设置响应头：状态码 200 (成功)，内容类型为 JSON
    res.writeHead(200, { "Content-Type": "application/json" })
    fs.readFile(dataFile, "utf8", (err, data) => {
      if (err) {
        // 9. 如果读取文件出错，返回 500 错误和错误信息
        console.error(`读取文件错误: ${err}`)
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("服务器内部错误，无法读取数据")
      } else {
        res.end(data)
      }
    })
  } else {
    // 11. 如果请求的不是 '/jobs'，返回 404 错误 (未找到)
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.end("404 - 页面未找到")
  }
})

// 14. 启动服务器，监听指定端口
server.listen(port, () => {
  console.log(`服务器正在运行，访问地址: http://localhost:${port}/jobs`)
})

// 13. 添加一个处理程序，在按 Ctrl+C 关闭服务器时打印消息
process.on("SIGINT", () => {
  console.log("\n服务器正在关闭...")
  server.close(() => {
    console.log("服务器已关闭。")
    process.exit()
  })
})
