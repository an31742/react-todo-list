
const express = require('express');
const router = express.Router();
// 简单的todos路由
let todos = [
  { id: 1, title: "学习React", completed: false, createdAt: new Date() },
  { id: 2, title: "学习Node.js", completed: false, createdAt: new Date() }
]
console.log("🚀 ~ todos:", todos)

router.get("/", (req, res) => {
  console.log("📋 当前todos:", todos)
  res.json({ todos, total: todos.length })
})

router.post("/", (req, res) => {
  const { title, description } = req.body

  if (!title) {
    return res.status(400).json({ error: "标题是必需的" })
  }

  const newTodo = {
    id: todos.length + 1,
    title,
    description: description || "",
    completed: false,
    createdAt: new Date()
  }

  todos.push(newTodo)
  console.log("✅ 新增后的todos:", todos)
  res.status(201).json(newTodo)
})

router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const todoIndex = todos.findIndex(todo => todo.id === id)

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo未找到" })
  }

  todos[todoIndex] = { ...todos[todoIndex], ...req.body, updatedAt: new Date() }
  console.log("🚀 ~ todos:", todos)
  res.json(todos[todoIndex])
})

router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const todoIndex = todos.findIndex(todo => todo.id === id)

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo未找到" })
  }

  todos.splice(todoIndex, 1)
  res.json({ message: "Todo删除成功" })
})


module.exports = router;