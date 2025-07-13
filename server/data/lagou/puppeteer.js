const puppeteer = require("puppeteer")
const fs = require("fs")
const path = require("path")

async function fetchLagouJobsWithPuppeteer(keyword = "高级前端", city = "北京") {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
  await page.setViewport({ width: 1280, height: 800 })

  // 加载 cookie
  const cookiePath = path.resolve(__dirname, "cookies.json")
  if (fs.existsSync(cookiePath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiePath))
    for (const cookie of cookies) {
      await page.setCookie(cookie)
    }
    console.log("已加载本地 cookie，自动登录拉钩网")
  } else {
    console.log("未检测到 cookie，请先运行 loginAndSaveCookie.js 手动登录一次！")
    await browser.close()
    return
  }

  const url = "https://www.lagou.com/jobs/list_" + encodeURIComponent(keyword) + "?city=" + encodeURIComponent(city)
  await page.goto(url, { waitUntil: "networkidle2" })

  // 手动登录
  console.log("请在浏览器中手动登录拉钩网，登录后按回车继续采集...")
  process.stdin.once("data", async () => {
    // 等待页面加载
    await new Promise((r) => setTimeout(r, 2000))
    // 采集职位信息
    const jobs = await page.evaluate(() => {
      const jobList = []
      document.querySelectorAll("ul").forEach((ul) => {
        ul.querySelectorAll("li").forEach((li) => {
          const titleA = li.querySelector("a[title]") || li.querySelector("a")
          const title = titleA ? titleA.innerText.trim() : ""
          let salary = ""
          li.querySelectorAll("span").forEach((span) => {
            if (/k|K/.test(span.innerText)) salary = span.innerText.trim()
          })
          let company = ""
          const aTags = li.querySelectorAll("a")
          if (aTags.length > 1) {
            company = aTags[1].innerText.trim()
          }
          if (title && salary) {
            jobList.push({ title, salary, company })
          }
        })
      })
      return jobList
    })

    console.log("采集到的职位：", jobs)

    const filePath = path.resolve(__dirname, "lagou_jobs.json")
    fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2))
    console.log("拉钩数据已保存，路径：", filePath)

    // await browser.close();
  })
}

fetchLagouJobsWithPuppeteer()
