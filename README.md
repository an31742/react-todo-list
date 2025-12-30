# React Todo List - Full Stack Learning Project

[中文](#中文文档) | [English](#english-documentation)

---

## 中文文档

### 🚀 项目简介

这是一个基于 **React + Node.js + MongoDB** 的全栈学习项目，集成了多个实用功能模块，帮助开发者学习现代前后端开发技术栈。项目采用 monorepo 架构，包含完整的前后端分离开发环境。

### ✨ 核心功能

#### 📱 前端功能模块
- **Todo 管理** - 完整的任务增删改查功能
- **图书管理系统** - MongoDB 数据操作实践
- **Redux 购物车** - 状态管理最佳实践
- **Markdown 编辑器** - 富文本编辑与预览
- **拖拽组件** - React DnD 交互实现
- **电影搜索** - 第三方 API 集成
- **天气应用** - 实时数据获取与展示
- **前端职位爬虫** - 数据可视化展示

#### 🔧 后端功能模块
- **用户认证系统** - JWT 身份验证
- **RESTful API** - 标准化接口设计
- **MongoDB 集成** - NoSQL 数据库操作
- **数据爬虫** - Puppeteer 网页数据抓取
- **文件上传** - 多媒体文件处理
- **日志系统** - 完整的错误处理和日志记录

### 🛠 技术栈

#### 前端技术
- **React 18** - 最新版本的 React 框架
- **React Router** - 单页应用路由管理
- **Redux Toolkit** - 现代化状态管理
- **Ant Design** - 企业级 UI 组件库
- **React DnD** - 拖拽功能实现
- **React Markdown** - Markdown 渲染
- **Axios** - HTTP 请求库

#### 后端技术
- **Node.js** - JavaScript 运行时环境
- **Express.js** - Web 应用框架
- **MongoDB** - NoSQL 文档数据库
- **JWT** - JSON Web Token 认证
- **Puppeteer** - 无头浏览器自动化
- **dotenv** - 环境变量管理

### 📁 项目结构

```
react-todo-list/
├── frontend/                 # React 前端项目
│   ├── src/
│   │   ├── components/       # 可复用组件
│   │   ├── pages/           # 页面组件
│   │   │   ├── book/        # 图书管理模块
│   │   │   ├── home/        # 首页
│   │   │   ├── job/         # 职位信息
│   │   │   └── ...          # 其他功能页面
│   │   ├── redux/           # Redux 状态管理
│   │   ├── services/        # API 服务层
│   │   ├── store/           # 状态存储配置
│   │   └── utils/           # 工具函数
│   └── package.json
├── server/                  # Node.js 后端项目
│   ├── routes/              # 路由处理
│   │   ├── auth.js          # 用户认证路由
│   │   ├── books.js         # 图书管理路由
│   │   ├── jobs.js          # 职位信息路由
│   │   └── todos.js         # Todo 路由
│   ├── mongoDb/             # 数据库配置
│   │   ├── db.js            # 数据库连接
│   │   └── curd.js          # 数据操作封装
│   ├── middleware/          # 中间件
│   ├── utils/               # 工具函数
│   ├── data/                # 爬虫数据存储
│   └── package.json
├── .gitignore
├── pnpm-workspace.yaml      # pnpm 工作空间配置
└── README.md
```

### 🚀 快速开始

#### 环境要求
- Node.js >= 16.0.0
- pnpm >= 8.0.0
- MongoDB 数据库

#### 安装依赖
```bash
# 安装所有依赖
pnpm install
```

#### 环境配置
1. 复制环境变量模板文件：
```bash
cp server/.env.example server/.env
```

2. 编辑 `server/.env` 文件，填入你的配置：
```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/?retryWrites=true&w=majority&appName=YourCluster
DB_NAME=your_database_name
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=8899
```

#### 启动项目
```bash
# 同时启动前后端服务
pnpm dev

# 或分别启动
pnpm --filter server dev    # 启动后端服务 (端口: 8899)
pnpm --filter frontend dev  # 启动前端服务 (端口: 3000)
```

#### 访问应用
- 前端应用: http://localhost:3000
- 后端 API: http://localhost:8899

### 📚 功能演示

访问 http://localhost:3000 体验以下功能：

1. **首页** - 项目概览和导航
2. **Todo 管理** - 任务的增删改查操作
3. **图书管理** - 完整的 CRUD 操作，支持批量删除
4. **Redux 购物车** - 状态管理实践
5. **Markdown 编辑器** - 实时预览和语法高亮
6. **拖拽组件** - 可拖拽排序的组件
7. **电影搜索** - 第三方 API 调用
8. **天气应用** - 实时天气数据展示
9. **前端职位** - 爬虫数据可视化

### 🔐 安全特性

- JWT Token 认证机制
- 环境变量安全管理
- 请求参数验证
- 错误处理和日志记录
- CORS 跨域配置

### 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

## English Documentation

### 🚀 Project Overview

A full-stack learning project built with **React + Node.js + MongoDB**, featuring multiple practical modules to help developers learn modern frontend and backend development technologies. The project uses a monorepo architecture with complete frontend-backend separation.

### ✨ Core Features

#### 📱 Frontend Modules
- **Todo Management** - Complete CRUD operations for tasks
- **Book Management System** - MongoDB data operations practice
- **Redux Shopping Cart** - State management best practices
- **Markdown Editor** - Rich text editing and preview
- **Drag & Drop Components** - React DnD interaction implementation
- **Movie Search** - Third-party API integration
- **Weather App** - Real-time data fetching and display
- **Job Crawler** - Data visualization for frontend positions

#### 🔧 Backend Modules
- **User Authentication** - JWT-based authentication system
- **RESTful APIs** - Standardized API design
- **MongoDB Integration** - NoSQL database operations
- **Web Scraping** - Puppeteer-based data extraction
- **File Upload** - Multimedia file handling
- **Logging System** - Complete error handling and logging

### 🛠 Tech Stack

#### Frontend Technologies
- **React 18** - Latest React framework
- **React Router** - SPA routing management
- **Redux Toolkit** - Modern state management
- **Ant Design** - Enterprise-class UI components
- **React DnD** - Drag and drop functionality
- **React Markdown** - Markdown rendering
- **Axios** - HTTP client library

#### Backend Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL document database
- **JWT** - JSON Web Token authentication
- **Puppeteer** - Headless browser automation
- **dotenv** - Environment variable management

### 📁 Project Structure

```
react-todo-list/
├── frontend/                 # React frontend project
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   │   ├── book/        # Book management module
│   │   │   ├── home/        # Homepage
│   │   │   ├── job/         # Job information
│   │   │   └── ...          # Other feature pages
│   │   ├── redux/           # Redux state management
│   │   ├── services/        # API service layer
│   │   ├── store/           # State store configuration
│   │   └── utils/           # Utility functions
│   └── package.json
├── server/                  # Node.js backend project
│   ├── routes/              # Route handlers
│   │   ├── auth.js          # Authentication routes
│   │   ├── books.js         # Book management routes
│   │   ├── jobs.js          # Job information routes
│   │   └── todos.js         # Todo routes
│   ├── mongoDb/             # Database configuration
│   │   ├── db.js            # Database connection
│   │   └── curd.js          # Data operation wrapper
│   ├── middleware/          # Middleware
│   ├── utils/               # Utility functions
│   ├── data/                # Scraped data storage
│   └── package.json
├── .gitignore
├── pnpm-workspace.yaml      # pnpm workspace configuration
└── README.md
```

### 🚀 Quick Start

#### Prerequisites
- Node.js >= 16.0.0
- pnpm >= 8.0.0
- MongoDB database

#### Install Dependencies
```bash
# Install all dependencies
pnpm install
```

#### Environment Setup
1. Copy the environment template file:
```bash
cp server/.env.example server/.env
```

2. Edit `server/.env` file with your configuration:
```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/?retryWrites=true&w=majority&appName=YourCluster
DB_NAME=your_database_name
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=8899
```

#### Start the Project
```bash
# Start both frontend and backend
pnpm dev

# Or start separately
pnpm --filter server dev    # Start backend server (port: 8899)
pnpm --filter frontend dev  # Start frontend server (port: 3000)
```

#### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8899

### 📚 Feature Demo

Visit http://localhost:3000 to experience:

1. **Homepage** - Project overview and navigation
2. **Todo Management** - CRUD operations for tasks
3. **Book Management** - Complete CRUD with batch delete
4. **Redux Shopping Cart** - State management practice
5. **Markdown Editor** - Real-time preview with syntax highlighting
6. **Drag & Drop Components** - Sortable draggable components
7. **Movie Search** - Third-party API integration
8. **Weather App** - Real-time weather data display
9. **Frontend Jobs** - Scraped data visualization

### 🔐 Security Features

- JWT Token authentication mechanism
- Secure environment variable management
- Request parameter validation
- Error handling and logging
- CORS configuration

### 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

---

**Start your full-stack development learning journey!** 🚀