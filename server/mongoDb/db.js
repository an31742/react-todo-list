require("dotenv").config()
const { MongoClient } = require("mongodb")

//mongodb 链接设置
const uri = process.env.MONGODB_URI
console.log("MongoDB URI:", uri)

const dbName = process.env.DB_NAME || "test"

//创建mongodb客户端
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

//数据库链接实例
let dbConnection

//链接数据库
async function connectToDatabase() {
  if (!dbConnection) {
    await client.connect()
    dbConnection = client.db(dbName)
  }
  return dbConnection
}

//关闭数据库链接
const closeDatabaseConnection = async () => {
  try {
    if (client) {
      await client.close()
      console.log("MongoDB connection closed")
    }
  } catch (error) {
    console.error("Error closing MongoDB connection:", error)
  }
}

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
}
