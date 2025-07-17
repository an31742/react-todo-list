const { connectToDatabase, closeDatabaseConnection } = require("./db")
const { ObjectId } = require("mongodb")

//图书模型
class Book {
  constructor({ title, author, year_published, genres, rating, copies_available, pages }) {
    this.title = title
    this.author = author
    this.year_published = year_published
    this.genres = genres || []
    this.rating = rating
    this.copies_available = copies_available
    this.pages = pages
  }
}

//操作类
class BookCRUD {
  constructor(collectionName = "books") {
    this.collectionName = collectionName
    this.db = null
    this.collection = null
  }

  //初始化链接
  async init() {
    this.db = await connectToDatabase()
    this.collection = this.db.collection(this.collectionName)
    return this
  }
  async createBooks(booksData) {
    try {
      const books = booksData.map((data) => new Book(data))
      const result = await this.collection.insertMany(books)
      console.log(`Created ${result.insertedCount} books`)
      return books.map((book, index) => ({ ...books, _id: result.insertedIds[index] }))
    } catch (error) {
      console.error("Error creating books:", error)
      throw error
    }
  }
  async getBookById(id) {
    try {
      return this.collection.findOne({ _id: id })
    } catch (error) {
      console.error(`Error getting book with ID ${id}:`, error)
      throw error
    }
  }

  async findBooks(query = {}, project = {}) {
    try {
      return this.collection.find(query, { project }).toArray()
    } catch (error) {
      console.error("Error finding books:", error)
      throw error
    }
  }
  async updateBook(id, updateData) {
    console.log("updateData", updateData)
    try {
      const result = await this.collection.updateOne(
        { _id: new ObjectId(id) }, // 如果用的是 MongoDB 默认主键
        { $set: updateData }
      )
      console.log("result", result)
      return result.modifiedCount > 0
    } catch (error) {
      console.error("Error finding books:", error)
      throw error
    }
  }

  async deleteBook(id) {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) })
      return result.deletedCount > 0
    } catch (error) {
      console.error("删除出错：", error)
      throw error
    }
  }
  async deleteBooks(filter) {
    try {
      const result = await this.collection.deleteMany(filter)
      console.log(`Deleted ${result.deletedCount} documents`)
      return result.deletedCount
    } catch (error) {
      console.error("Error deleting books:", error)
      throw error
    }
  }
}
module.exports = BookCRUD
