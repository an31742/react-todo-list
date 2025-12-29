import { useState, useEffect } from 'react';
import { todoService } from '../services/todoService';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 添加todo
  const addTodo = async (todoData) => {
    try {
      const newTodo = await todoService.createTodo(todoData);
      setTodos(prev => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // 更新todo
  const updateTodo = async (id, todoData) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, todoData);
      setTodos(prev => prev.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // 删除todo
  const deleteTodo = async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // 切换完成状态
  const toggleTodo = async (id) => {
    try {
      const updatedTodo = await todoService.toggleTodo(id);
      setTodos(prev => prev.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refetch: fetchTodos,
  };
};