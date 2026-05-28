import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios'
import { Input, Button, Checkbox, message, Progress } from 'antd';
import { PlusOutlined, DeleteOutlined, InboxOutlined, EditOutlined } from '@ant-design/icons';
import './TodoPage.css';

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '进行中' },
  { key: 'completed', label: '已完成' },
]
//输入框每一次更新都触发渲染 一个字符渲染两次  也就是是说调用setSate都会重新渲染两次
const TodoPage = () => {
  console.log('TodoPage渲染')
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  // 1. 修改状态：记录正在编辑的任务 ID，而不是简单的 boolean
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null)

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/todos')
      setTodos(response.data.todos || [])
    } catch (error) {
      console.error('获取数据失败:', error)
      message.error('获取数据失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

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

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    const response = await axios.put(`/api/todos/${id}`, {
      completed: !todo.completed
    })
    setTodos(todos.map(todo =>
      todo.id === id ? response.data : todo
    ));
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`)
      message.success('删除成功');
      setTodos(todos.filter(t => t.id !== id))
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 2. 修改编辑处理函数
  const EditTodo = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.title); // 初始化编辑值为当前标题
  };

  // 3. 新增保存逻辑
  const handleSaveEdit = async (id) => {
    if (!editValue.trim()) {
      message.warning('内容不能为空');
      return;
    }
    
    try {
      // 调用 API 更新
      const response = await axios.put(`/api/todos/${id}`, {
        title: editValue
      });
      
      // 更新本地状态
      setTodos(todos.map(t => t.id === id ? response.data : t));
      setEditingId(null); // 退出编辑模式
      message.success('更新成功');
    } catch (error) {
      message.error('更新失败: ' + error.message);
    }
  };

  // 4. 新增取消逻辑
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  // 5. 新增 useEffect：监听 editingId 变化，自动聚焦
  useEffect(() => {
    if (editingId && inputRef.current) {
      // 确保 DOM 更新后聚焦
      inputRef.current.focus();
      // 可选：选中所有文本，方便用户直接覆盖
      inputRef.current.select();
    }
  }, [editingId]);

  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter(t => !t.completed)
    if (filter === 'completed') return todos.filter(t => t.completed)
    return todos
  }, [todos, filter])

  const completedCount = todos.filter(t => t.completed).length
  const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0

  useEffect(() => {
    console.log('✅ DOM 已更新');
    fetchTodos();
  }, [])

  return (
    <div className="todo-wrapper">
      {/* Header */}
      <div className="todo-header">
        <div className="todo-header-left">
          <h2>任务管理</h2>
          <p>管理你的待办事项，跟踪完成进度</p>
        </div>
        <div className="todo-progress-ring">
          <div className="todo-progress-text">
            <div className="count">{completedCount}/{todos.length}</div>
            <div className="label">已完成</div>
          </div>
          <Progress
            type="circle"
            percent={progress}
            size={52}
            strokeColor="#10b981"
            trailColor="#e2e8f0"
            format={() => ''}
          />
        </div>
      </div>

      {/* Input */}
      <div className="todo-input-area">
        <Input
          className="todo-input-field"
          placeholder="输入新的待办事项，按 Enter 添加"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onPressEnter={addTodo}
          disabled={loading}
        />
        <Button
          type="primary"
          className="todo-add-btn"
          icon={<PlusOutlined />}
          onClick={addTodo}
          loading={loading}
        >
          添加
        </Button>
      </div>

      {/* Filter */}
      <div className="todo-stats">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            className={`todo-stat-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            <span className="count">
              {f.key === 'all' ? todos.length :
                f.key === 'active' ? todos.filter(t => !t.completed).length :
                  todos.filter(t => t.completed).length}
            </span>
          </Button>
        ))}
      </div>

      {/* List */}
      {filteredTodos.length > 0 ? (
        <div className="todo-list">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <Checkbox
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
               {/* 6. 条件渲染：判断当前项是否处于编辑状态 */}
              {editingId === todo.id ? (
                <input
                  className="todo-item-title"
                  ref={inputRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleSaveEdit(todo.id)} // 失焦保存
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(todo.id);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
              ) : (
                <span className="todo-item-title">{todo.title}</span>
              )}
              <Button
                type="text"
                className="todo-item-edit"
                icon={<EditOutlined />}
                onClick={() => EditTodo(todo)}
              />
              <Button
                type="text"
                className="todo-item-delete"
                icon={<DeleteOutlined />}
                onClick={() => deleteTodo(todo.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="todo-empty">
          <div className="todo-empty-icon">
            <InboxOutlined />
          </div>
          <p className="todo-empty-text">
            {filter === 'all' ? '还没有待办事项，添加一条吧' :
              filter === 'active' ? '没有进行中的事项' :
                '没有已完成的事项'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoPage;
