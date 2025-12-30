import React, { useEffect, useState } from "react"
import { Modal, Button, Input, message, Table, Space, Form } from "antd"
import axios from "axios"
import BookForm from "./BookForm"

const BookCardList = () => {
  const [books, setBooks] = useState([])
  const [editingBook, setEditingBook] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const fetchBooks = async () => {
    const res = await axios.get("/api/books")
    setBooks(res.data)
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleDelete = async (book) => {
    await axios.delete(`/api/books/delete/${book._id}`)
    message.success("删除成功")
    fetchBooks()
  }

  const handleEdit = async (book) => {
    console.log("🚀 ~ handleEdit ~ book:", book)
    const detail = await axios.get(`/api/books/detail?id=${book._id}`)
    console.log("🚀 ~ handleEdit ~ detail:", detail)
    setEditingBook(detail.data)
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
  const handleDeteles = async () => {
    let deteles = await axios.delete('/api/books/delete', {
      data: {
        ids: selectedRows.map(i => i._id)
      }
    })
    console.log("🚀 ~ handleDeteles ~ deteles:", deteles)
    message.success('删除成功')
    fetchBooks()
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRows(selectedRows)
    },
    getCheckboxProps: record => {
      console.log("🚀 ~ BookCardList ~ record:", record)
      return {
        disabled: record.title === '水浒传', // Column configuration not to be checked
        title: record.title,
      };
    },
  };
  const columns = [
    {
      title: "书名",
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
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
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
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
          <a onClick={() => handleEdit(record)}>编辑 {record.name}</a>
          <a onClick={() => handleDelete(record)}>删除</a>
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

          <Button style={{ marginLeft: '20px' }} type="primary" onClick={handleAdd}>添加书</Button>
          <Button style={{ marginLeft: '20px' }} type="primary" onClick={handleDeteles}>批量删除</Button>
        </Form>
      </div>
      <Table rowKey="_id" rowSelection={{ type: 'checkbox', ...rowSelection }} columns={columns} dataSource={books} />

      <Modal open={showForm} onCancel={() => setShowForm(false)} footer={null} destroyOnClose>
        <BookForm style={{ minHeight: '400px' }} initialValues={editingBook} onOk={handleFormOk} onCancel={() => setShowForm(false)} />
      </Modal>
    </div>

  )
}

export default BookCardList
