import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Input, List, Checkbox, message, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);

  // 获取todos列表
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/todos');
      setTodos(response.data.todos || []);
    } catch (error) {
      message.error('获取数据失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 添加todo
  const addTodo = async () => {
    if (!newTodo.trim()) {
      message.warning('请输入待办事项');
      return;
    }

    try {
      const response = await axios.post('/api/todos', {
        title: newTodo,
        description: ''
      });
      
      setTodos([...todos, response.data]);
      setNewTodo('');
      message.success('添加成功');
    } catch (error) {
      message.error('添加失败: ' + error.message);
    }
  };

  // 切换完成状态
  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      const response = await axios.put(`/api/todos/${id}`, {
        completed: !todo.completed
      });
      
      setTodos(todos.map(t => 
        t.id === id ? response.data : t
      ));
    } catch (error) {
      message.error('更新失败: ' + error.message);
    }
  };

  // 删除todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败: ' + error.message);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Card title="Todo 管理" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Input
            placeholder="输入新的待办事项"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onPressEnter={addTodo}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={addTodo}>
            添加
          </Button>
        </div>

        <Spin spinning={loading}>
          <List
            dataSource={todos}
            renderItem={(todo) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteTodo(todo.id)}
                  />
                ]}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                >
                  <span style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#999' : '#000'
                  }}>
                    {todo.title}
                  </span>
                </Checkbox>
              </List.Item>
            )}
          />
        </Spin>

        <div style={{ marginTop: '20px', color: '#666' }}>
          总计: {todos.length} 项，已完成: {todos.filter(t => t.completed).length} 项
        </div>
      </Card>
    </div>
  );
};

export default TodoPage;