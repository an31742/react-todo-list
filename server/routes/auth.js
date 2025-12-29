const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserModel = require('../models/UserSimple');
const authMiddleware = require('../middleware/auth');
const { connectToDatabase } = require('../mongoDb/db');

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    const db = await connectToDatabase();
    const userModel = new UserModel(db);
    
    const user = await userModel.create({ username, email, password });
    
    // 生成JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.message === 'User already exists') {
      return res.status(409).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const db = await connectToDatabase();
    const userModel = new UserModel(db);
    
    // 查找用户
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 验证密码
    const isValidPassword = await userModel.validatePassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 生成JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// 获取用户信息
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// 更新用户信息
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const db = await connectToDatabase();
    const userModel = new UserModel(db);
    
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }
      updateData.password = password;
    }
    
    const user = await userModel.updateById(req.user._id, updateData);
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// 刷新token
router.post('/refresh', authMiddleware, async (req, res) => {
  try {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ token });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// 登出
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // 在实际应用中，你可能想要将token加入黑名单
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

module.exports = router;