import React, { useEffect, useState } from "react"
import { Card, Button, Modal, message } from "antd"
import axios from "axios"
import BookForm from "./BookForm"

const BookCardList = () => {
  const [books, setBooks] = useState([])
  const [editingBook, setEditingBook] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const fetchBooks = async () => {
    const res = await axios.get("/api/books")
    setBooks(res.data)
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleDelete = async (id) => {
    await axios.delete(`/api/books/delete/${id}`)
    message.success("删除成功")
    fetchBooks()
  }

  const handleEdit = (book) => {
    setEditingBook(book)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingBook(null)
    setShowForm(true)
  }

  const handleFormOk = async (values) => {
    console.log("editingBook", editingBook)
    if (editingBook) {
      await axios.put(`/api/books/update/${editingBook._id}`, values)
      message.success("更新成功")
    } else {
      await axios.post("/api/books/add", [values])
      message.success("添加成功")
    }
    setShowForm(false)
    fetchBooks()
  }

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        新增图书
      </Button>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {books.map((book) => (
          <Card
            key={book._id}
            title={book.title}
            style={{ width: 300 }}
            actions={[
              <Button type="link" onClick={() => handleEdit(book)}>
                编辑
              </Button>,
              <Button type="link" danger onClick={() => handleDelete(book._id)}>
                删除
              </Button>,
            ]}
          >
            <div>作者: {book.author}</div>
            <div>出版年份: {book.year_published}</div>
            <div>类型: {Array.isArray(book.genres) ? book.genres.join(", ") : book.genres}</div>
            {book.rating && <div>评分: {book.rating}</div>}
            {book.copies_available && <div>库存: {book.copies_available}</div>}
            {book.pages && <div>页数: {book.pages}</div>}
          </Card>
        ))}
      </div>
      <Modal open={showForm} onCancel={() => setShowForm(false)} footer={null} destroyOnClose>
        <BookForm initialValues={editingBook} onOk={handleFormOk} onCancel={() => setShowForm(false)} />
      </Modal>
    </div>
  )
}

export default BookCardList
