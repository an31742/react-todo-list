const axios = require("axios")

const fs = require("fs")

const path = require("path")

const cookies = require("./cookies.json")

const headers = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  cookie: cookies.map((c) => `${c.name}=${c.value}`).join("; "),
}

const output = []

async function fetchPage(pageNum = 1) {
  const url = "https://www.zhipin.com/wapi/zpgeek/search/joblist.json"
  const params = {
    page: pageNum,
    pageSize: 15,
    city: "101010100",
    query: "高级前端工程师",
    scene: 1,
    _: Date.now(),
  }
  try {
    const res = await axios.get(url, { headers, params })
    // 检查反爬
    if (res.data.code !== 0) {
      console.error(`❌ 第 ${pageNum} 页请求失败：${res.data.message}`)
      return
    }
    const list = res.data.zpData?.jobList || []
    output.push(...list)
    console.log(`✅ 第 ${pageNum} 页数据获取成功，共 ${list.length} 条`)
    if (list.length === 15) {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 防封延时
      await fetchPage(pageNum + 1)
    }
  } catch (error) {
    console.error(`❌ 第 ${pageNum} 页请求失败：`, error.message)
  }
}
fetchPage().then(() => {
  fs.writeFileSync(path.join(__dirname, "boss-frontend.json"), JSON.stringify(output, null, 2))
  console.log("✅ 所有数据已保存")
})
