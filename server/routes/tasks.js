const express = require('express')
const router = express.Router()

// 模拟任务数据
let tasks = [
  { 
    id: '1', 
    title: '设计UI界面', 
    description: '完成用户界面设计',
    status: 'todo', 
    priority: 'high', 
    assignee: { id: '1', name: 'Alice', avatar: '' },
    projectId: 'project1'
  },
  { 
    id: '2', 
    title: '开发后端API', 
    description: '实现RESTful API接口',
    status: 'inProgress', 
    priority: 'medium', 
    assignee: { id: '2', name: 'Bob', avatar: '' },
    projectId: 'project1'
  },
  { 
    id: '3', 
    title: '编写测试用例', 
    description: '完成单元测试和集成测试',
    status: 'done', 
    priority: 'low', 
    assignee: { id: '3', name: 'Charlie', avatar: '' },
    projectId: 'project1'
  }
]

// 获取任务列表
router.get('/', (req, res) => {
  const { projectId } = req.query
  let filteredTasks = tasks
  
  if (projectId) {
    filteredTasks = tasks.filter(task => task.projectId === projectId)
  }
  
  res.json(filteredTasks)
})

// 更新任务
router.put('/:id', (req, res) => {
  const { id } = req.params
  const updates = req.body
  
  console.log('更新任务 ID:', id, '更新数据:', updates)
  
  const taskIndex = tasks.findIndex(t => t.id === id)
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates }
    console.log('更新成功:', tasks[taskIndex])
    res.json(tasks[taskIndex])
  } else {
    console.log('任务未找到, ID:', id)
    res.status(404).json({ error: '任务未找到' })
  }
})

// 创建新任务
router.post('/', (req, res) => {
  const newTask = {
    id: Date.now().toString(),
    ...req.body,
    projectId: req.body.projectId || 'project1'
  }
  tasks.push(newTask)
  res.status(201).json(newTask)
})

// 删除任务
router.delete('/:id', (req, res) => {
  const { id } = req.params
  const taskIndex = tasks.findIndex(t => t.id === id)
  
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1)
    res.json({ success: true })
  } else {
    res.status(404).json({ error: '任务未找到' })
  }
})

module.exports = router