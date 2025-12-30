const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();


let users = [
  {
    id: 1,
    username: "admin",
    email: "an31742@outlook.com",
    password: "123456"
  },
  {
    id: 2,
    username: "admin1",
    email: "1139564521@qq.com",
    password: "123456"
  },
  {
    id: 3,
    username: "1",
    email: "1",
    password: "1"
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




module.exports = router;