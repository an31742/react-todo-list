const express = require('express');
const router = express.Router();
const TodoModel = require('../models/Todo');
const authMiddleware = require('../middleware/auth');
const { connectToDatabase } = require('../mongoDb/db');

// 所有路由都需要认证
router.use(authMiddleware);

// 获取用户的所有todos
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, sort = 'createdAt', order = 'desc' } = req.query;
    
    const db = await connectToDatabase();
    const todoModel = new TodoModel(db);
    
    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort: { [sort]: order === 'desc' ? -1 : 1 }
    };
    
    const todos = await todoModel.findByUserId(req.user._id, options);
    const stats = await todoModel.getStats(req.user._id);
    
    res.json({
      todos,
      stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: stats.total
      }
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// 创建新todo
router.post('/', async (req, res) => {
  try {
    const { title, description, priority = 'medium', dueDate } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const db = await connectToDatabase();
    const todoModel = new TodoModel(db);
    
    const todoData = {
      title: title.trim(),
      description: description?.trim() || '',
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: req.user._id
    };
    
    const todo = await todoModel.create(todoData);
    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// 更新todo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, completed } = req.body;
    
    const db = await connectToDatabase();
    const todoModel = new TodoModel(db);
    
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (completed !== undefined) updateData.completed = completed;
    
    const todo = await todoModel.updateById(id, req.user._id, updateData);
    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    if (error.message === 'Todo not found') {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// 切换todo完成状态
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = await connectToDatabase();
    const todoModel = new TodoModel(db);
    
    const todo = await todoModel.toggleCompleted(id, req.user._id);
    res.json(todo);
  } catch (error) {
    console.error('Toggle todo error:', error);
    if (error.message === 'Todo not found') {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
});

// 删除todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = await connectToDatabase();
    const todoModel = new TodoModel(db);
    
    const deleted = await todoModel.deleteById(id, req.user._id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// 获取统计信息
router.get('/stats', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const todoModel = new TodoModel(db);
    
    const stats = await todoModel.getStats(req.user._id);
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;