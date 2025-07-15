const { readFile, writeFile } = require("fs/promises")
const path = require("path")

const BOSS_FILE = path.join(__dirname, "boss_jobs_all.json")
const BACKUP_FILE = path.join(__dirname, "backup.json")

let bosses = []

initializeBoss()
function initializeBoss() {
  return readBossFile()
    .then((data) => {
      bosses = data
      console.log(`已加载 ${bosses.length} 个BOSS`)
    })
    .catch((error) => {
      console.error("初始化BOSS错误:", error)
      bosses = []
    })
}

readBossFile()
async function readBossFile() {
  try {
    const data = await readFile(BOSS_FILE, "utf8")
    return JSON.parse(data)
  } catch {
    console.log("尝试从备份文件加载...")
    const backupData = await readFile(BACKUP_FILE, "utf8")
    return JSON.parse(backupData)
  }
}

function getAllBosses() {
  return bosses
}

function createBoss(bossData) {
  const newBoss = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: "pending",
    ...bossData,
  }
  bosses.push(newBoss)
  saveBossToFile()
  return newBoss
}

function updateBoss(id, updatedData) {
  const bossIndex = bosses.findIndex((item) => item.id === String(id))
  if (bossIndex === -1) {
    return null
  }
  const updateBoss = {
    ...bosses[bossIndex],
    ...updatedData,
    updatedAt: new Date().toISOString(),
  }
  bosses[bossIndex] = updateBoss
  saveBossToFile()
  return updateBoss
}

// 删除接口，防止误删，仅从主数据文件删除，不删除备份数据
function removeBoss(id) {
  const originalLength = bosses.length
  bosses = bosses.filter((item) => item.id !== id)
  if (bosses.length === originalLength) {
    // 没有删除任何数据
    return bosses
  }
  saveBossToMainFileOnly()
  return bosses
}

// 只保存主数据文件，不覆盖备份
async function saveBossToMainFileOnly() {
  try {
    await writeFile(BOSS_FILE, JSON.stringify(bosses, null, 2))
    console.log(`已保存 ${bosses.length} 个任务到主数据文件`)
  } catch (error) {
    console.error("保存主数据文件错误:", error)
  }
}

async function saveBossToFile() {
  try {
    await writeFile(BACKUP_FILE, JSON.stringify(bosses, null, 2))
    await writeFile(BOSS_FILE, JSON.stringify(bosses, null, 2))
    console.log(`已保存 ${bosses.length} 个任务`)
  } catch (error) {
    console.error("保存任务错误:", error)
  }
}

module.exports = {
  initializeBoss,
  getAllBosses,
  createBoss,
  updateBoss,
  saveBossToFile,
  removeBoss,
}
