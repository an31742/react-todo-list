// login.js
const puppeteer = require("puppeteer")
const fs = require("fs")
const path = require("path")

async function getCookies() {
  const browser = await puppeteer.launch({ headless: false }) // 可视化模式，方便调试
  const page = await browser.newPage()

  await page.goto("https://www.lagou.com/", { waitUntil: "networkidle2" })

  // 手动登录（扫码登录或输入密码）
  console.log("请在页面中手动完成登录，然后按 Enter...")
  process.stdin.once("data", async () => {
    const cookies = await page.cookies()
    console.log("Cookies 获取成功：")
    console.log(JSON.stringify(cookies, null, 2))
    const filePath = path.resolve(__dirname, "cookies.json")
    fs.writeFileSync(filePath, JSON.stringify(cookies, null, 2))
    await browser.close()
    process.exit()
  })
}

getCookies()
