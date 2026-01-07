const express = require('express')
//处理上传文件的格式
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router()

// 确保上传目录存在
//获取文件夹里面的数据
const uploadDir = path.join(__dirname, '../uploads/avatars')
// 创建目录
if (!fs.existsSync(uploadDir)) {
  //获取到目录里面的文件
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 配置 multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname))
  }
})
//获取到实例 处理中间件文件的 根据这个处理文件
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 这是文件大小
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('只允许上传图片文件'))
    }
  }
})

// 头像上传接口  通过接口获取到前端的数据
router.post('/avatar', upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' })
    }

    console.log('上传的文件信息:', req.file)
    console.log('文件名:', req.file.filename)
    console.log('文件路径:', req.file.path)

    const fileUrl =`${process.env.SERVER_URL || 'http://localhost:8899'}/uploads/avatars/${req.file.filename}`
    console.log('生成的文件URL:', fileUrl)

    res.json({
      success: true,
      url: fileUrl,
      message: '头像上传成功'
    })
  } catch (error) {
    console.error('头像上传错误:', error)
    res.status(500).json({ error: '头像上传失败' })
  }
})

module.exports = router