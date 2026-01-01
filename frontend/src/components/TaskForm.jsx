import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const TaskForm = ({ visible, task, onSave, onCancel, loading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && task) {
      form.setFieldsValue(task);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, task, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={task ? '编辑任务' : '新建任务'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {task ? '更新' : '创建'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          priority: 'medium',
          status: 'todo',
        }}
      >
        <Form.Item
          name="title"
          label="任务标题"
          rules={[{ required: true, message: '请输入任务标题' }]}
        >
          <Input placeholder="输入任务标题" />
        </Form.Item>

        <Form.Item
          name="description"
          label="任务描述"
          rules={[{ required: true, message: '请输入任务描述' }]}
        >
          <TextArea rows={3} placeholder="输入任务描述" />
        </Form.Item>

        <Form.Item
          name="priority"
          label="优先级"
          rules={[{ required: true, message: '请选择优先级' }]}
        >
          <Select placeholder="选择优先级">
            <Option value="low">低</Option>
            <Option value="medium">中</Option>
            <Option value="high">高</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="assigneeName"
          label="负责人"
        >
          <Input placeholder="输入负责人姓名" />
        </Form.Item>

        {!task && (
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="选择状态">
              <Option value="todo">待办</Option>
              <Option value="inProgress">进行中</Option>
              <Option value="done">已完成</Option>
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default TaskForm;