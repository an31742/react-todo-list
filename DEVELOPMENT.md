# React Todo List - 全栈开发指南

## 📋 项目概述

这是一个基于 **React + Node.js + MongoDB** 的全栈学习项目，包含用户认证、Todo管理、图书管理、协作看板、文件上传等多个实用功能模块。项目采用 monorepo 架构，集成了现代前后端开发的最佳实践。

## 🏗️ 项目架构

### 前端架构 (React 18)
```
frontend/src/
├── components/              # 可复用组件
│   ├── markDown/           # Markdown编辑器组件
│   ├── moveSearch/         # 电影搜索组件
│   ├── reactDnd/           # 拖拽组件
│   ├── shoppIngCar/        # 购物车组件
│   ├── weatherCards/       # 天气卡片组件
│   ├── TaskCard.jsx        # 任务卡片
│   ├── TaskColumn.jsx      # 任务列
│   └── TaskForm.jsx        # 任务表单
├── pages/                  # 页面组件
│   ├── book/              # 图书管理模块
│   ├── CollaborativeBoard.jsx  # 协作看板
│   ├── LoginPage.jsx      # 登录页面
│   ├── TodoPage.jsx       # Todo管理
│   ├── MarkDownEdit.jsx   # Markdown编辑器
│   ├── ReduxShoppingCart.jsx  # Redux购物车
│   └── Weather.jsx        # 天气应用
├── redux/                 # Redux状态管理
├── services/              # API服务层
│   ├── api.js            # 通用API配置
│   ├── authService.js    # 认证服务
│   └── todoService.js    # Todo服务
├── store/                 # 状态存储
│   ├── reduxShoppingCart/ # 购物车状态
│   ├── index.js          # Store配置
│   └── taskSlice.js      # 任务状态切片
└── utils/                 # 工具函数
```

### 后端架构 (Node.js + Express)
```
server/
├── routes/                # API路由
│   ├── auth.js           # 用户认证路由
│   ├── books.js          # 图书管理路由
│   ├── todos.js          # Todo路由
│   ├── tasks.js          # 任务路由
│   ├── upload.js         # 文件上传路由
│   ├── jobs.js           # 职位信息路由
│   └── boss.js           # Boss直聘数据路由
├── mongoDb/               # 数据库配置
│   ├── db.js             # 数据库连接
│   ├── curd.js           # CRUD操作封装
│   └── booksData.json    # 图书示例数据
├── middleware/            # 中间件
│   └── auth.js           # JWT认证中间件
├── lib/                   # 核心库
│   ├── logger.js         # 日志中间件
│   └── errorHandler.js   # 错误处理中间件
├── data/                  # 爬虫数据存储
│   ├── boss/             # Boss直聘数据
│   ├── lagou/            # 拉勾网数据
│   └── job/              # 通用职位数据
├── uploads/               # 文件上传目录
│   └── avatars/          # 头像文件
└── utils/                 # 工具函数
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- pnpm >= 8.0.0
- MongoDB 数据库

### 1. 安装依赖
```bash
# 安装所有依赖
pnpm install
```

### 2. 环境配置
```bash
# 复制环境变量模板
cp server/.env.example server/.env

# 编辑环境变量
vim server/.env
```

### 3. 启动项目
```bash
# 同时启动前后端服务
pnpm dev

# 或分别启动
pnpm --filter server dev    # 后端服务 (端口: 8899)
pnpm --filter frontend dev  # 前端服务 (端口: 3000)
```

## 🛠️ 技术栈详解

### 前端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.2.0 | 前端框架 |
| React Router | ^6.22.3 | 路由管理 |
| Redux Toolkit | ^2.8.2 | 状态管理 |
| Ant Design | ^5.26.5 | UI组件库 |
| React DnD | ^16.0.1 | 拖拽功能 |
| React Markdown | ^10.1.0 | Markdown渲染 |
| Axios | ^1.10.0 | HTTP请求 |

### 后端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| Express.js | ^5.1.0 | Web框架 |
| MongoDB | ^6.17.0 | 数据库 |
| JWT | ^9.0.2 | 身份验证 |
| Socket.io | 集成 | 实时通信 |
| Multer | 集成 | 文件上传 |
| Puppeteer | ^24.12.1 | 网页爬虫 |

## 📚 功能模块详解

### ✅ 已完成功能

#### 1. 用户认证系统
- **登录/注册** - JWT Token认证
- **权限控制** - 路由守卫
- **头像上传** - 支持图片上传和预览

#### 2. Todo管理系统
- **CRUD操作** - 增删改查功能
- **状态管理** - Redux集成
- **数据持久化** - MongoDB存储

#### 3. 图书管理系统
- **完整CRUD** - 支持批量操作
- **搜索功能** - 条件查询
- **分页展示** - 大数据处理

#### 4. 协作看板
- **实时协作** - Socket.io实现
- **拖拽排序** - React DnD
- **多用户同步** - 在线状态显示

#### 5. 文件上传系统
- **头像上传** - 支持多种图片格式
- **文件验证** - 类型和大小限制
- **静态文件服务** - Express静态资源

#### 6. 数据爬虫系统
- **Boss直聘** - 前端职位数据
- **拉勾网** - 职位信息爬取
- **数据可视化** - 职位统计展示

#### 7. 其他功能模块
- **Markdown编辑器** - 实时预览
- **Redux购物车** - 状态管理实践
- **电影搜索** - 第三方API集成
- **天气应用** - 实时数据获取
- **拖拽组件** - 交互式组件

### 🔄 开发中功能
- WebSocket实时通知
- 用户个人资料管理
- 数据统计图表

### 📋 待开发功能
- 邮件通知系统
- 移动端适配
- 国际化支持
- 单元测试覆盖

## 📖 API文档

### 认证相关 API
```http
POST /api/auth/register     # 用户注册
POST /api/auth/login        # 用户登录
POST /api/auth/loginOut     # 用户退出
```

### Todo管理 API
```http
GET    /api/todos           # 获取Todo列表
POST   /api/todos           # 创建新Todo
PUT    /api/todos/:id       # 更新Todo
DELETE /api/todos/:id       # 删除Todo
```

### 图书管理 API
```http
GET    /api/books           # 获取图书列表
POST   /api/books/add       # 添加图书
PUT    /api/books/update/:id # 更新图书
DELETE /api/books/delete/:id # 删除图书
DELETE /api/books/delete    # 批量删除
GET    /api/books/detail    # 获取图书详情
```

### 任务管理 API
```http
GET    /api/tasks           # 获取任务列表
POST   /api/tasks           # 创建任务
PUT    /api/tasks/:id       # 更新任务
DELETE /api/tasks/:id       # 删除任务
```

### 文件上传 API
```http
POST   /api/upload/avatar   # 上传头像
POST   /api/upload/file     # 通用文件上传
```

## 🎯 开发任务

### 高优先级任务

#### 任务1: 完善用户个人资料
**目标**: 实现用户信息管理功能
- [ ] 个人资料编辑页面
- [ ] 头像裁剪功能
- [ ] 密码修改功能
- [ ] 用户偏好设置

#### 任务2: 实现消息通知系统
**目标**: 添加实时通知功能
- [ ] 系统通知组件
- [ ] WebSocket消息推送
- [ ] 通知历史记录
- [ ] 邮件通知集成

#### 任务3: 数据统计仪表板
**目标**: 创建数据可视化页面
- [ ] Todo完成率统计
- [ ] 用户活跃度分析
- [ ] 图书借阅统计
- [ ] 响应式图表组件

### 中优先级任务

#### 任务4: 移动端适配
**目标**: 优化移动设备体验
- [ ] 响应式布局优化
- [ ] 触摸手势支持
- [ ] PWA功能集成
- [ ] 移动端专用组件

#### 任务5: 性能优化
**目标**: 提升应用性能
- [ ] 代码分割和懒加载
- [ ] 图片优化和CDN
- [ ] API缓存策略
- [ ] 数据库查询优化

### 低优先级任务

#### 任务6: 国际化支持
**目标**: 多语言支持
- [ ] i18n配置
- [ ] 多语言资源文件
- [ ] 语言切换组件
- [ ] 时区处理

## 🔧 开发工具配置

### VS Code 推荐插件
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### 代码格式化配置
```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## 📝 编码规范

### React组件规范
```javascript
// 函数组件 - PascalCase命名
const TodoItem = ({ todo, onUpdate, onDelete }) => {
  // Hooks在组件顶部
  const [isEditing, setIsEditing] = useState(false)
  
  // 事件处理函数 - handle前缀
  const handleSubmit = useCallback((data) => {
    onUpdate(todo.id, data)
    setIsEditing(false)
  }, [todo.id, onUpdate])
  
  // 条件渲染
  if (isEditing) {
    return <TodoEditForm todo={todo} onSubmit={handleSubmit} />
  }
  
  return (
    <div className="todo-item">
      <span>{todo.title}</span>
      <button onClick={() => setIsEditing(true)}>编辑</button>
    </div>
  )
}
```

### API路由规范
```javascript
// RESTful API设计
router.get('/todos', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const todos = await todoService.findAll({ page, limit, status })
    
    res.json({
      success: true,
      data: todos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: todos.total
      }
    })
  } catch (error) {
    console.error('获取Todo列表失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})
```

## 🐛 常见问题解决

### 1. 跨域问题
```javascript
// 前端代理配置 (package.json)
{
  "proxy": "http://localhost:8899"
}

// 后端CORS配置
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

### 2. MongoDB连接问题
```javascript
// 检查环境变量
console.log('MongoDB URI:', process.env.MONGODB_URI)

// 连接错误处理
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB连接成功'))
  .catch(err => console.error('MongoDB连接失败:', err))
```

### 3. JWT Token处理
```javascript
// 前端Token存储
localStorage.setItem('token', response.data.token)

// 请求拦截器
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## 📈 性能优化建议

### 前端优化
- **代码分割**: 使用React.lazy和Suspense
- **状态优化**: 合理使用useCallback和useMemo
- **组件优化**: React.memo避免不必要渲染
- **图片优化**: WebP格式和懒加载

### 后端优化
- **数据库索引**: 为常用查询字段添加索引
- **缓存策略**: Redis缓存热点数据
- **连接池**: 数据库连接池管理
- **压缩中间件**: Gzip压缩响应数据

## 🧪 测试策略

### 单元测试
```javascript
// Jest + React Testing Library
import { render, screen, fireEvent } from '@testing-library/react'
import TodoItem from '../TodoItem'

test('应该正确渲染Todo项目', () => {
  const todo = { id: 1, title: '测试任务', completed: false }
  render(<TodoItem todo={todo} />)
  
  expect(screen.getByText('测试任务')).toBeInTheDocument()
})
```

### 集成测试
```javascript
// Supertest + Jest
const request = require('supertest')
const app = require('../app')

describe('POST /api/todos', () => {
  test('应该创建新的Todo', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: '新任务', description: '任务描述' })
      .expect(201)
    
    expect(response.body.success).toBe(true)
  })
})
```

## 🚀 部署指南

### 开发环境
```bash
# 启动开发服务器
pnpm dev
```

### 生产环境
```bash
# 构建前端
pnpm --filter frontend build

# 启动生产服务器
pnpm --filter server start
```

### Docker部署
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8899
CMD ["npm", "start"]
```

## 🤝 贡献指南

1. **Fork项目** - 创建你的项目副本
2. **创建分支** - `git checkout -b feature/amazing-feature`
3. **提交更改** - `git commit -m 'Add amazing feature'`
4. **推送分支** - `git push origin feature/amazing-feature`
5. **创建PR** - 提交Pull Request

### 提交信息规范
```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
```

## 📚 学习资源

### 官方文档
- [React 官方文档](https://react.dev/)
- [Express.js 文档](https://expressjs.com/)
- [MongoDB 文档](https://docs.mongodb.com/)
- [Ant Design 文档](https://ant.design/)

### 推荐教程
- React Hooks 深入理解
- Redux Toolkit 最佳实践
- Node.js 性能优化
- MongoDB 索引优化

---

**开始你的全栈开发学习之旅！** 🚀

记住：优秀的代码不仅要能运行，还要易于理解和维护。持续学习，持续改进！