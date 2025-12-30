import React from "react"
import { Form, Input, InputNumber, Button } from "antd"

const BookForm = ({ initialValues, onOk, onCancel }) => {
  const [form] = Form.useForm()

  const handleFinish = (values) => {
    console.log("values", values)
    let genres = values.genres
    if (Array.isArray(genres)) {
      // 已经是数组，直接用
    } else if (typeof genres === "string") {
      genres = genres.split(",")
    } else {
      genres = [] // 或者给个默认值
    }
    onOk(values)
  }

  return (
    <Form form={form} initialValues={initialValues} onFinish={handleFinish} layout="vertical">
      <Form.Item name="title" label="书名" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="author" label="作者" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="year_published" label="出版年份">
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="genres" label="类型（逗号分隔）">
        <Input />
      </Form.Item>
      <Form.Item name="rating" label="评分">
        <InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="copies_available" label="库存">
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="pages" label="页数">
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={onCancel}>
          取消
        </Button>
      </Form.Item>
    </Form>
  )
}

export default BookForm
