//引入核心模块
const fs = require("fs")

//2 定义和输出文件ming
const inputFile = "jobs.txt"

const outputFile = "jobs.json"

// 33. 使用 fs.readFileSync 同步读取 jobs.txt 文件内容 (新手先用同步方法简单)
//// 'utf8' 参数告诉 Node 以文本格式读取，得到字符串而不是二进制数据
const data = fs.readFileSync(inputFile, "utf8")
// 4. 打印读取到的原始数据到控制台，验证是否读取成功
console.log("--- 从文件读取的原始数据 ---")
console.log(data)

//将文字的字符串分割
const lines = data.split("\n")
//创建一个空的数组来储存处理后的对象职位
const jobs = []
for (const line of lines) {
  if (line.trim() === "") continue
  // 假设我们用逗号 ',' 分隔字段 (根据你的 jobs.txt 格式调整)
  const parts = line.split(",")
  //创建一个对象的职位然后从分割的对象中提取数组
  const job = {
    title: parts[0].trim(), // 职位名称，去掉首尾空格
    location: parts[1].trim(), // 工作地点
    industry: parts[2].trim(), // 行业
    salary: parts[3].trim(), // 薪资范围
    requirements: parts[4].trim(), // 技能要求
  }
  const avgSeniorSalary = jobs
    .filter((job) => job.title.includes("高级"))
    .map((job) => job.salary)
    .reduce((sum, salary, idx, arr) => {
      sum += salary
      return idx === arr.length - 1 ? sum / arr.length : sum
    }, 0)
  const keywords = ["高级", "资深", "架构师"]
  // 检查职位标题 (job.title) 是否包含 keywords 数组中的任意一个词
  // some() 方法：如果数组中至少有一个元素满足提供的测试函数，则返回 true
  // const isSeniorPosition = keywords.some((keyword) => job.title.includes(keyword))
  const seniorJobs = jobs.filter((job) => job.title.includes("高级")).push({ avgSeniorSalary: avgSeniorSalary })
  console.log("seniorJobs", seniorJobs)
  // 如果是高级职位，则将其添加到 jobs 数组中

  if (seniorJobs.length > 0) {
    jobs.push(job)
  }
}

// 10. 打印处理后的 jobs 数组到控制台，验证转换是否成功
console.log("\n--- 处理后的职位数据 (数组) ---")
console.log(jobs)
//将数据转换为json
const jsonData = JSON.stringify(jobs, null, 2)

// 12. 使用 fs.writeFileSync 同步将 JSON 字符串写入 jobs.json 文件
fs.writeFileSync(outputFile, jsonData, "utf8")

// 13. 打印成功消息
console.log(`\n✅ 数据已成功写入文件: ${outputFile}`)
