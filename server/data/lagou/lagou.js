// crawl.js
const axios = require("axios")
const fs = require("fs")
const path = require("path")

const cookies = require("./cookies.json") // 使用上一步获取的 cookies

const headers = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  cookie: cookies.map((c) => `${c.name}=${c.value}`).join("; "),
}

const output = []

async function fetchPage(pageNum = 1) {
  const url = "https://www.lagou.com/jobs/positionAjax.json?needAddtionalResult=false"
  const data = `pn=${pageNum}&kd=高级前端`

  try {
    const res = await axios.post(url, data, { headers, timeout: 10000 })
    console.log("res", res)
    const list = res.data.content.positionResult.result
    console.log("list", list)
    output.push(...list)

    console.log(`✅ 第 ${pageNum} 页数据获取成功，共 ${list.length} 条`)
    if (list.length === 15) {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 防封延时
      await fetchPage(pageNum + 1)
    }
  } catch (err) {
    console.error(`❌ 第 ${pageNum} 页请求失败：`, err.message)
  }
}

fetchPage().then(() => {
  fs.writeFileSync(path.join(__dirname, "lagou-frontend.json"), JSON.stringify(output, null, 2))
  console.log("✅ 所有数据已保存")
})
// 运行时：
