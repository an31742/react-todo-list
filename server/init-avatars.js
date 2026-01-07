const fs = require('fs')
const path = require('path')

// 确保 avatars 目录存在
const avatarsDir = path.join(__dirname, '../uploads/avatars')
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true })
}

// 创建默认头像（使用 SVG 格式）
const defaultAvatars = [
  {
    name: 'default-avatar-1.svg',
    content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#4CAF50"/>
      <text x="50" y="60" text-anchor="middle" fill="white" font-size="40" font-family="Arial">A</text>
    </svg>`
  },
  {
    name: 'default-avatar-2.svg', 
    content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#2196F3"/>
      <text x="50" y="60" text-anchor="middle" fill="white" font-size="40" font-family="Arial">B</text>
    </svg>`
  },
  {
    name: 'default-avatar-3.svg',
    content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#FF9800"/>
      <text x="50" y="60" text-anchor="middle" fill="white" font-size="40" font-family="Arial">C</text>
    </svg>`
  }
]

// 创建默认头像文件
defaultAvatars.forEach(avatar => {
  const filePath = path.join(avatarsDir, avatar.name)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, avatar.content)
    console.log(`创建默认头像: ${avatar.name}`)
  }
})

console.log('默认头像初始化完成')