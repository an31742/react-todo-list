const puppeteer = require("puppeteer")
const fs = require("fs")
const path = require("path")

async function getCookies() {
  // 注意：puppeteer.launch 的参数应该是 headless（无头模式），而不是 headLess，L 应该小写
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  try {
    // 有些网站会检测自动化工具，可以尝试设置一些常用的防检测参数
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    )
    await page.setExtraHTTPHeaders({
      "accept-language": "zh-CN,zh;q=0.9"
    })

    // 访问 boss 直聘首页
    await page.goto("https://www.zhipin.com/", { waitUntil: "networkidle2" })
    console.log("页面已打开，请手动扫码或输入账号密码登录，然后按 Enter...")

    process.stdin.once("data", async () => {
      const cookies = await page.cookies()
      console.log("Cookies 获取成功：")
      console.log(JSON.stringify(cookies, null, 2))
      const filePath = path.resolve(__dirname, "cookies.json")
      fs.writeFileSync(filePath, JSON.stringify(cookies, null, 2))
      await browser.close()
      process.exit()
    })
  } catch (err) {
    console.error("打开 boss 直聘失败，错误信息：", err)
    await browser.close()
    process.exit(1)
  }
}

getCookies()
