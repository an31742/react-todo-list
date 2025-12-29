# React + Node.js 全栈学习项目

这是一个基于 React + Node.js + MongoDB 的全栈学习项目，包含多个实用功能模块，帮助你学习现代前后端开发技术。

## 🚀 项目特色

### 前端技术栈 (React)
- **React 18** - 最新版本的React
- **React Router** - 单页应用路由管理
- **Redux Toolkit** - 状态管理
- **Ant Design** - UI组件库
- **React DnD** - 拖拽功能
- **React Markdown** - Markdown编辑器
- **Axios** - HTTP请求库

### 后端技术栈 (Node.js)
- **Express.js** - Web框架
- **MongoDB** - NoSQL数据库
- **JWT** - 身份验证
- **Multer** - 文件上传
- **Socket.io** - 实时通信
- **Puppeteer** - 网页爬虫

## 📁 项目结构

```
react-todo-list/
├── frontend/                 # React前端项目
│   ├── src/
│   │   ├── components/       # 可复用组件
│   │   ├── pages/           # 页面组件
│   │   ├── hooks/           # 自定义Hooks
│   │   ├── utils/           # 工具函数
│   │   ├── services/        # API服务
│   │   └── store/           # Redux状态管理
│   └── public/              # 静态资源
├── server/                  # Node.js后端项目
│   ├── routes/              # 路由处理
│   ├── models/              # 数据模型
│   ├── middleware/          # 中间件
│   ├── utils/               # 工具函数
│   └── config/              # 配置文件
└── docs/                    # 项目文档
```

## 🎯 学习模块

### 1. 基础Todo应用
- ✅ CRUD操作
- ✅ 状态管理
- ✅ 组件通信

### 2. 用户系统
- 🔄 用户注册/登录
- 🔄 JWT身份验证
- 🔄 权限管理

### 3. 文件管理
- 🔄 文件上传
- 🔄 图片预览
- 🔄 文件下载

### 4. 实时功能
- 🔄 WebSocket通信
- 🔄 实时聊天
- 🔄 在线状态

### 5. 数据可视化
- 🔄 图表展示
- 🔄 数据统计
- 🔄 报表生成

### 6. 高级功能
- ✅ 拖拽排序
- ✅ Markdown编辑器
- ✅ 购物车系统
- 🔄 搜索功能
- 🔄 分页加载

## 🛠 开发环境设置

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
# 同时启动前后端
pnpm dev

# 或分别启动
pnpm start:server    # 启动后端 (端口: 8899)
pnpm start:frontend  # 启动前端 (端口: 3000)
```

### 环境变量配置
在 `server/.env` 文件中配置：
```env
MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
PORT=8899
```

## 📚 学习路径

### 初级阶段
1. 熟悉React基础语法和组件
2. 学习Express.js和MongoDB基础
3. 完成Todo应用的CRUD功能

### 中级阶段
1. 掌握React Hooks和状态管理
2. 学习用户认证和权限控制
3. 实现文件上传和处理

### 高级阶段
1. 学习WebSocket实时通信
2. 掌握性能优化技巧
3. 实现复杂的业务逻辑

## 🎨 功能演示

访问 http://localhost:3000 查看所有功能模块：

- **Todo管理** - 基础的增删改查
- **图书管理** - MongoDB数据操作
- **购物车** - Redux状态管理
- **Markdown编辑器** - 富文本编辑
- **拖拽组件** - React DnD实现
- **电影搜索** - API调用和数据展示
- **天气应用** - 第三方API集成

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

---

**开始你的全栈开发学习之旅吧！** 🚀