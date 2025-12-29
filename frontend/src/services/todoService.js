import api from './api';

export const todoService = {
  // 获取所有todos
  getTodos: () => api.get('/api/todos'),
  
  // 创建新todo
  createTodo: (todo) => api.post('/api/todos', todo),
  
  // 更新todo
  updateTodo: (id, todo) => api.put(`/api/todos/${id}`, todo),
  
  // 删除todo
  deleteTodo: (id) => api.delete(`/api/todos/${id}`),
  
  // 切换todo完成状态
  toggleTodo: (id) => api.patch(`/api/todos/${id}/toggle`),
};