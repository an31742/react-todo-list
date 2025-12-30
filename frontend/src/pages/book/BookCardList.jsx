import React, { useEffect, useState } from "react"
import { Card, Button, Input, message, Table, Space, Form } from "antd"
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

  const onFinish = async (values) => {
    console.log(values)
  }

  const onFinishFailed = async (values) => {
    console.log(values)
  }

  const columns = [
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      render: text => <a>{text}</a>,
    },
    {
      title: '出版年份',
      dataIndex: 'year_published',
      key: 'year_published',
    },
    {
      title: '库存',
      dataIndex: 'copies_available',
      key: 'copies_available',
    },
    {
      title: '页数',
      key: 'pages',
      dataIndex: 'pages',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={handleEdit}>编辑 {record.name}</a>
          <a onClick={handleDelete}>删除</a>
        </Space>
      ),
    },
  ]


  return (

    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        < Form
          name="basic"
          layout="inline"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, margin: '20px' }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="书名"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>

          <Button style={{ marginLeft:'20px' }} type="primary" onClick={handleAdd}>添加书</Button>
        </Form>
      </div>


      <Table columns={columns} dataSource={books} />
    </div>
  )
}

export default BookCardList
