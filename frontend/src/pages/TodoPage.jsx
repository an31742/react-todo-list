import React, { useState } from 'react';
import { Card, Button, Input, List, Checkbox, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const TodoPage = () => {
  const [todos, setTodos] = useState([
    { id: 1, title: '学习React', completed: false },
    { id: 2, title: '学习Node.js', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (!newTodo.trim()) {
      message.warning('请输入待办事项');
      return;
    }
    
    const todo = {
      id: Date.now(),
      title: newTodo,
      completed: false,
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
    message.success('添加成功');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    message.success('删除成功');
  };

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
        
        <div style={{ marginTop: '20px', color: '#666' }}>
          总计: {todos.length} 项，已完成: {todos.filter(t => t.completed).length} 项
        </div>
      </Card>
    </div>
  );
};

export default TodoPage;