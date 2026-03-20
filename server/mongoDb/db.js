require("dotenv").config()
const { MongoClient } = require("mongodb")

// mongodb 链接设置
const uri = process.env.MONGODB_URI
const dbName = process.env.DB_NAME || "Cluster0"

console.log("MongoDB URI:", uri ? "已配置" : "未配置")

// 数据库链接实例
let dbConnection
let client

// 链接数据库
async function connectToDatabase() {
  try {
    if (!uri) {
      console.error("❌ MongoDB URI 未配置！请设置 MONGODB_URI 环境变量")
      throw new Error("MONGODB_URI 环境变量未设置")
    }
    
    if (!dbConnection) {
      // 延迟创建客户端，只有在实际需要时才创建
      if (!client) {
        client = new MongoClient(uri, {
          serverSelectionTimeoutMS: 5000, // 服务器选择超时时间
          socketTimeoutMS: 45000, // socket 超时时间
          maxPoolSize: 10, // 连接池大小
        })
      }
      
      console.log("🔌 正在连接 MongoDB...")
      await client.connect()
      dbConnection = client.db(dbName)
      console.log(`✅ MongoDB 连接成功！数据库：${dbName}`)
    }
    return dbConnection
  } catch (error) {
    console.error("❌ MongoDB 连接失败:", error.message)
    console.error("错误详情:", error.stack)
    throw error
  }
}

// 关闭数据库链接
const closeDatabaseConnection = async () => {
  try {
    if (client) {
      await client.close()
      console.log("🔌 MongoDB connection closed")
    }
  } catch (error) {
    console.error("❌ Error closing MongoDB connection:", error)
  }
}

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
}
