# Express Logging & Error Middleware

## 安装
```bash
npm install express-logging-error-middleware
```
## 使用

```js
const {logger,errorHandler}=require("express-logging-error-middleware")

const app = express()

app.use(
  logger({
    logDir: "./test-logs",
    format: ":method :url :status - :response-time ms",
  })
)

app.use(errorHandler({ debug: true }))
```