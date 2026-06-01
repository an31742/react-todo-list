import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import axios from 'axios'
import { Input, Button, Checkbox, message, Progress } from 'antd';
import { PlusOutlined, DeleteOutlined, InboxOutlined, EditOutlined } from '@ant-design/icons';
import './TodoPage.css';

// ── TodoItem 组件（已优化版：React.memo + 接收稳定 props）──
const TodoItem = React.memo(function TodoItem({ todo, editingId, editValue, inputRef, onToggle, onEdit, onSave, onCancel, onDelete, onEditValueChange }) {
  console.log('🔵 [递] TodoItem', todo.id, todo.title);
  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
    >
      <Checkbox
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {editingId === todo.id ? (
        <input
          className="todo-item-title"
          ref={inputRef}
          value={editValue}
          onChange={(e) => onEditValueChange(e.target.value)}
          onBlur={() => onSave(todo.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave(todo.id);
            if (e.key === 'Escape') onCancel();
          }}
        />
      ) : (
        <span className="todo-item-title">{todo.title}</span>
      )}
      <Button
        type="text"
        className="todo-item-edit"
        icon={<EditOutlined />}
        onClick={() => onEdit(todo)}
      />
      <Button
        type="text"
        className="todo-item-delete"
        icon={<DeleteOutlined />}
        onClick={() => onDelete(todo.id)}
      />
    </div>
  );
});

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '进行中' },
  { key: 'completed', label: '已完成' },
]

const TodoPage = () => {
  console.log('🔵 [递] TodoPage')
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null)

  // ── 用 ref 保存 todos，让回调函数不依赖 todos 变量 ──
  const todosRef = useRef(todos);
  todosRef.current = todos;

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

  const addTodo = useCallback(async () => {
    if (!newTodo.trim()) {
      message.warning('请输入待办事项');
      return;
    }
    try {
      const response = await axios.post('/api/todos', {
        title: newTodo,
        description: ''
      });
      setTodos(prev => [...prev, response.data]);
      setNewTodo('');
      message.success('添加成功');
    } catch (error) {
      message.error('添加失败: ' + error.message);
    }
  }, [newTodo]);

  // ✅ 优化：useCallback + 从 todosRef 读取最新数据（依赖 [] → 引用永远不变）
  const toggleTodo = useCallback(async (id) => {
    const todo = todosRef.current.find(t => t.id === id);
    const response = await axios.put(`/api/todos/${id}`, {
      completed: !todo.completed
    })
    setTodos(prev => prev.map(t =>
      t.id === id ? response.data : t
    ));
  }, []);

  const deleteTodo = useCallback(async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`)
      message.success('删除成功');
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      message.error('删除失败');
    }
  }, []);

  const EditTodo = useCallback((todo) => {
    setEditingId(todo.id);
    setEditValue(todo.title);
  }, []);

  const handleSaveEdit = useCallback(async (id) => {
    if (!editValue.trim()) {
      message.warning('内容不能为空');
      return;
    }
    try {
      const response = await axios.put(`/api/todos/${id}`, {
        title: editValue
      });
      setTodos(prev => prev.map(t => t.id === id ? response.data : t));
      setEditingId(null);
      message.success('更新成功');
    } catch (error) {
      message.error('更新失败: ' + error.message);
    }
  }, [editValue]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditValue('');
  }, []);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
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
            <TodoItem
              key={todo.id}
              todo={todo}
              editingId={editingId}
              editValue={editValue}
              inputRef={inputRef}
              onToggle={toggleTodo}
              onEdit={EditTodo}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              onDelete={deleteTodo}
              onEditValueChange={setEditValue}
            />
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
