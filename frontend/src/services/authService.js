import api from './api';

export const authService = {
  // 用户登录
  login: (credentials) => api.post('/api/auth/login', credentials),
  
  // 用户注册
  register: (userData) => api.post('/api/auth/register', userData),
  
  // 获取用户信息
  getProfile: () => api.get('/api/auth/profile'),
  
  // 刷新token
  refreshToken: () => api.post('/api/auth/refresh'),
  
  // 登出
  logout: () => api.post('/api/auth/logout'),
};