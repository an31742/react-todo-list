const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();


let users = [
  {
    id: 1,
    username: "admin",
    email: "an31742@outlook.com",
    password: "123456",
    role: "admin",
    avatar: "http://localhost:8899/uploads/avatars/avatar-1767804857912-543071773.webp"
  },
  {
    id: 2,
    username: "admin1",
    email: "1139564521@qq.com",
    password: "123456",
    role: "editor",
    avatar: "http://localhost:8899/uploads/avatars/avatar-1767804857912-543071773.webp"
  },
  {
    id: 3,
    username: "1",
    email: "1",
    password: "1",
    role: "viewer",
    avatar: "http://localhost:8899/uploads/avatars/avatar-1767804857912-543071773.webp"
  }
]

let tokenBlacklist = new Set()
let tokenUserMap = new Map()

function createTokenForUser(userId) {
  const token = `demo-token-${userId}-${Date.now()}`
  tokenUserMap.set(token, userId)
  return token
}

router.post("/register", (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: "所有字段都是必需的" })
  }

  users.push({
    id: users.length + 1,
    username,
    email,
    password,
    role: 'viewer',
  })

  const newUser = users[users.length - 1]
  const token = createTokenForUser(newUser.id)

  res.json({
    message: "注册成功",
    user: { username, email, role: 'viewer' },
    token
  })
})

router.post("/login", (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "邮箱和密码都是必需的" })
  }

  const userFlag = users.find(item => item.email === email && item.password === password)
  if (userFlag) {
    const token = createTokenForUser(userFlag.id)
    res.json({
      message: "登录成功",
      user: {
        id: userFlag.id,
        username: userFlag.username,
        email: userFlag.email,
        role: userFlag.role,
      },
      token
    })
  } else {
    res.status(401).json({ error: "邮箱或者密码错误" })
  }
})

function logoutHandler(req, res) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (token) {
      tokenBlacklist.add(token)
      tokenUserMap.delete(token)
    }
    res.status(200).json({
      message: '退出成功',
    })
  } catch (error) {
    res.status(500).json({
      error: '退出失败',
      details: error.message,
    })
  }
}

router.post("/loginOut", logoutHandler)
router.post("/logout", logoutHandler)

router.get("/profile", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: '未提供token' })
  }

  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'token已失效' })
  }

  const userId = tokenUserMap.get(token)
  const user = users.find(u => u.id === userId)
  if (user) {
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || 'viewer',
      avatar: user.avatar
    })
  } else {
    res.status(404).json({ error: '用户不存在' })
  }
})

router.put("/profile", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: '未提供token' })
  }

  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'token已失效' })
  }

  const { avatar } = req.body
  const userId = tokenUserMap.get(token)
  const user = users.find(u => u.id === userId)
  if (user) {
    if (avatar) user.avatar = avatar
    res.json({
      message: '更新成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || 'viewer',
        avatar: user.avatar
      }
    })
  } else {
    res.status(404).json({ error: '用户不存在' })
  }
})

module.exports = router;
