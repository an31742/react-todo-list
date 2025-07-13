//boss 反爬虫严重所以使用puppteer

const puppeteer = require("puppeteer")
const fs = require("fs")
const path = require("path")

async function fetchBossJobs(keyword = "高级前端工程师", city = "北京") {
  //调用浏览器
  const browser = await puppeteer.launch({ headless: false })
  //使用一个新的页
  const page = await browser.newPage()
  //设置浏览器的型号
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
  // 设置浏览器窗口大小
  await page.setViewport({ width: 1280, height: 800 })

  // 打开 BOSS 直聘首页
  await page.goto("https://www.zhipin.com/web/geek/job", { waitUntil: "networkidle2" })

  // 手动登录
  console.log("请在浏览器中手动登录BOSS直聘，登录后按回车继续采集...")
  process.stdin.once("data", async () => {
    // 输入关键词
    await page.type('input[placeholder="搜索职位、公司"]', keyword, { delay: 100 })
    // 点击搜索按钮
    await page.click("a.search-btn")
    // 等待职位卡片出现
    await page.waitForSelector(".job-card-wrap", { timeout: 15000 })

    // 无限下拉，直到加载完所有职位
    let previousHeight = await page.evaluate("document.body.scrollHeight")
    while (true) {
      await page.evaluate("window.scrollBy(0, window.innerHeight)")
      await new Promise((r) => setTimeout(r, 1500))
      // 检查页面是否跳转
      const currentUrl = page.url()
      if (!currentUrl.includes("zhipin.com")) {
        console.error("页面发生跳转，终止采集！")
        break
      }
      let newHeight = await page.evaluate("document.body.scrollHeight")
      if (newHeight === previousHeight) {
        await new Promise((r) => setTimeout(r, 2000))
        newHeight = await page.evaluate("document.body.scrollHeight")
        if (newHeight === previousHeight) break
      }
      previousHeight = newHeight
    }

    // 采集所有职位数据
    const jobs = await page.evaluate(() => {
      // 字体映射表
      const fontMap = { "": "0", "": "1", "": "2", "": "3", "": "4", "": "5", "": "6", "": "7", "": "8", "": "9" }
      function decodeSalary(salaryStr) {
        return salaryStr.replace(/[\uE000-\uF8FF]/g, (m) => fontMap[m] || m)
      }
      const jobList = []
      document.querySelectorAll(".job-card-wrap").forEach((item) => {
        const title = item.querySelector(".job-title, .job-title.clearfix")?.innerText || item.querySelector(".job-title")?.innerText || item.querySelector("h3")?.innerText || ""

        // 采集原始薪资
        const rawSalary = item.querySelector('[class*="salary"]')?.innerText || ""
        // 还原真实薪资
        const salary = decodeSalary(rawSalary)
        // 岗位需求
        const desc = item.querySelector(".YWDyrFaHNxR")?.innerText || ""
        const company = item.querySelector(".boss-name")?.innerText || item.querySelector(".company-name")?.innerText || ""
        if (title && salary && company) {
          jobList.push({ title, salary, company, desc })
        }
      })
      return jobList
    })

    console.log("采集到的职位：", jobs.length)

    const filePath = path.resolve(__dirname, "boss_jobs_all.json")
    fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2))
    console.log("BOSS直聘全部职位数据已保存，路径：", filePath)
  })
}

fetchBossJobs()
