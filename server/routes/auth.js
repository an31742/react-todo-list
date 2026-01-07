const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();


let users = [
  {
    id: 1,
    username: "admin",
    email: "an31742@outlook.com",
    password: "123456",
    avatar: "http://localhost:8899/uploads/avatars/avatar-1767804857912-543071773.webp"
  },
  {
    id: 2,
    username: "admin1",
    email: "1139564521@qq.com",
    password: "123456",
    avatar: "http://localhost:8899/uploads/avatars/avatar-1767804857912-543071773.webp"
  },
  {
    id: 3,
    username: "1",
    email: "1",
    password: "1",
    avatar: "http://localhost:8899/uploads/avatars/avatar-1767804857912-543071773.webp"
  }
]

let tokenBlacklist = new Set()
// 简单的认证路由
router.post("/register", (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: "所有字段都是必需的" })
  }

  users.push({
    id: users.length + 1,
    username,
    email,
    password
  })
  console.log("🚀 ~ users:", users)
  res.json({
    message: "注册成功",
    user: { username, email },
    token: "demo-token-" + Date.now()
  })
})

router.post("/login", (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "邮箱和密码都是必需的" })
  }

  const userFlag = users.find(item => item.email === email && item.password === password)
  console.log("🚀 ~ users:", users)
  console.log("🚀 ~ userFlag:", userFlag)
  if (userFlag) {
    res.json({
      message: "登录成功",
      user: { email },
      token: "demo-token-" + Date.now()
    })
  } else {
    res.status(401).json({ error: "邮箱或者密码错误" })
  }

})


router.post("/loginOut", (req, res) => {
  console.log("=== 退出登录接口被调用 ===")
  console.log("请求方法:", req.method)
  console.log("请求路径:", req.path)
  console.log("请求头:", req.headers)
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (token) {
    tokenBlacklist.add(token)
  }
  res.status(200).json({
    mesage: '退出成功',
  })
})

// 获取用户信息
router.get("/profile", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: '未提供token' })
  }

  // 简单的token验证（实际项目中应该使用JWT验证）
  const user = users.find(u => u.email) // 简化处理，返回第一个用户
  if (user) {
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar
    })
  } else {
    res.status(404).json({ error: '用户不存在' })
  }
})

// 更新用户信息 更新头像信息 所以一开始与用户user里面的数据已经变了
router.put("/profile", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: '未提供token' })
  }

  const { avatar } = req.body
  const user = users.find(u => u.email) // 简化处理
  if (user) {
    if (avatar) user.avatar = avatar
    res.json({
      message: '更新成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    })
  } else {
    res.status(404).json({ error: '用户不存在' })
  }
})




module.exports = router;