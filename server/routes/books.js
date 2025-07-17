const express = require("express")
const router = express.Router()
const BookCRUD = require("../mongoDb/curd")
const { closeDatabaseConnection } = require("../mongoDb/db")

// 获取所有图书
router.get("/", async (req, res) => {
  try {
    const bookCRUD = await new BookCRUD().init()
    const books = await bookCRUD.findBooks()
    res.status(200).json(books)
  } catch (error) {
    console.error("接口报错：", error)
    res.status(500).json({ error: "服务器内部错误" })
  }
})

// 新增图书（批量）
router.post("/add", async (req, res) => {
  try {
    const sampleBooks = req.body
    const bookCRUD = await new BookCRUD().init()
    const createdBooks = await bookCRUD.createBooks(sampleBooks)
    res.status(201).json(createdBooks)
  } catch (error) {
    console.error("接口报错：", error)
    res.status(500).json({ error: "服务器内部错误" })
  }
})

// 查询图书（可带条件和投影）
router.get("/query", async (req, res) => {
  try {
    const query = req.query.query ? JSON.parse(req.query.query) : {}
    const project = req.query.project ? JSON.parse(req.query.project) : {}
    const bookCRUD = await new BookCRUD().init()
    const books = await bookCRUD.findBooks(query, project)
    res.status(200).json(books)
  } catch (error) {
    console.error("接口报错：", error)
    res.status(500).json({ error: "服务器内部错误" })
  }
})

// 更新图书（单本）
router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id
    const updateData = req.body
    const bookCRUD = await new BookCRUD().init()
    const result = await bookCRUD.updateBook(id, updateData)
    res.status(200).json({ success: result })
  } catch (error) {
    console.error("接口报错：", error)
    res.status(500).json({ error: "服务器内部错误" })
  }
})

// 批量更新图书
router.put("/update", async (req, res) => {
  try {
    const { filter, update } = req.body
    const bookCRUD = await new BookCRUD().init()
    const result = await bookCRUD.updateBooks(filter, update)
    res.status(200).json({ success: result })
  } catch (error) {
    console.error("接口报错：", error)
    res.status(500).json({ error: "服务器内部错误" })
  }
})

// 删除单本图书
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id
    const bookCRUD = await new BookCRUD().init()
    const result = await bookCRUD.deleteBook(id)
    res.status(200).json({ success: result })
  } catch (error) {
    console.error("接口报错：", error)
    res.status(500).json({ error: "服务器内部错误" })
  }
})

// 批量删除图书
router.delete("/delete", async (req, res) => {
  try {
    const filter = req.body
    const bookCRUD = await new BookCRUD().init()
    const deletedCount = await bookCRUD.deleteBooks(filter)
    res.status(200).json({ deletedCount })
  } catch (error) {
    console.error("接口报错：", error)
    res.status(500).json({ error: "服务器内部错误" })
  }
})

module.exports = router
