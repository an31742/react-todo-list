const { readFile, writeFile } = require("fs/promises")
const path = require("path")

// 任务数据文件路径
const JOBS_FILE = path.join(__dirname, "jobs.json")
const BACKUP_FILE = path.join(__dirname, "backup.json")

let jobs = []

// 初始化任务系统
function initializeJobs() {
  return readJobsFile()
    .then((data) => {
      jobs = data
      console.log(`已加载 ${jobs.length} 个任务`)
    })
    .catch((error) => {
      console.error("初始化任务错误:", error)
      jobs = []
    })
}

// 读取任务文件
async function readJobsFile() {
  try {
    // 尝试从 jobs.json 加载
    const data = await readFile(JOBS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.log("尝试从备份文件加载...")
    // 尝试从备份加载
    const backupData = await readFile(BACKUP_FILE, "utf8")
    return JSON.parse(backupData)
  }
}

// 获取所有任务
function getAllJobs() {
  return jobs
}

// 创建新任务
function createJob(jobData) {
  const newJob = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: "pending",
    ...jobData,
  }

  jobs.push(newJob)
  saveJobsToFile()
  return newJob
}

// 更新任务
function updateJob(jobId, updatedData) {
  const jobIndex = jobs.findIndex((job) => job.id === jobId)

  if (jobIndex === -1) return null

  const updatedJob = {
    ...jobs[jobIndex],
    ...updatedData,
    updatedAt: new Date().toISOString(),
  }

  jobs[jobIndex] = updatedJob
  saveJobsToFile()
  return updatedJob
}

// 保存任务到文件
async function saveJobsToFile() {
  try {
    // 创建备份
    await writeFile(BACKUP_FILE, JSON.stringify(jobs, null, 2))

    // 保存新数据
    await writeFile(JOBS_FILE, JSON.stringify(jobs, null, 2))
    console.log(`已保存 ${jobs.length} 个任务`)
  } catch (error) {
    console.error("保存任务错误:", error)
  }
}

// 导出接口
module.exports = {
  initializeJobs,
  getAllJobs,
  createJob,
  updateJob,
  saveJobsToFile,
}
