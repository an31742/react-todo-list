# React + Node.js 全栈开发学习指南

## 📋 项目概述

这是一个完整的全栈学习项目，包含用户认证、Todo管理、图书管理等多个功能模块。通过这个项目，你将学习到现代前后端开发的核心技术。

## 🏗️ 项目架构

### 前端架构 (React)
```
frontend/src/
├── components/          # 可复用组件
├── pages/              # 页面组件
├── hooks/              # 自定义Hooks
├── services/           # API服务层
├── store/              # Redux状态管理
└── utils/              # 工具函数
```

### 后端架构 (Node.js)
```
server/
├── models/             # 数据模型
├── routes/             # API路由
├── middleware/         # 中间件
├── utils/              # 工具函数
└── config/             # 配置文件
```

## 🚀 快速开始

### 1. 安装依赖
```bash
pnpm install
```

### 2. 启动项目
```bash
# 同时启动前后端
pnpm dev

# 或分别启动
pnpm start:server    # 后端 (端口: 8899)
pnpm start:frontend  # 前端 (端口: 3000)
```

## 📚 学习路径

### 阶段一：基础功能 (已完成)
- ✅ 项目结构搭建
- ✅ 用户认证系统
- ✅ Todo CRUD操作
- ✅ MongoDB数据库集成

### 阶段二：前端进阶 (待开发)
- 🔄 React Hooks深入使用
- 🔄 Redux状态管理优化
- 🔄 组件性能优化
- 🔄 响应式设计

### 阶段三：后端进阶 (待开发)
- 🔄 文件上传功能
- 🔄 数据验证和错误处理
- 🔄 API文档生成
- 🔄 单元测试

### 阶段四：高级功能 (待开发)
- 🔄 WebSocket实时通信
- 🔄 数据可视化
- 🔄 性能监控
- 🔄 部署和CI/CD

## 🛠️ 技术栈详解

### 前端技术
- **React 18**: 最新的React版本，支持并发特性
- **React Router**: 客户端路由管理
- **Axios**: HTTP请求库
- **Ant Design**: UI组件库
- **Redux Toolkit**: 状态管理

### 后端技术
- **Express.js**: Web应用框架
- **MongoDB**: NoSQL数据库
- **JWT**: 身份验证
- **bcrypt**: 密码加密
- **dotenv**: 环境变量管理

## 📖 API文档

### 认证相关
```
POST /api/auth/register  # 用户注册
POST /api/auth/login     # 用户登录
GET  /api/auth/profile   # 获取用户信息
PUT  /api/auth/profile   # 更新用户信息
```

### Todo相关
```
GET    /api/todos        # 获取todos列表
POST   /api/todos        # 创建新todo
PUT    /api/todos/:id    # 更新todo
DELETE /api/todos/:id    # 删除todo
PATCH  /api/todos/:id/toggle  # 切换完成状态
```

## 🎯 学习任务

### 任务1: 完善Todo前端界面
**目标**: 创建一个美观的Todo管理界面

**要求**:
- 使用Ant Design组件
- 实现添加、编辑、删除功能
- 支持优先级设置
- 添加截止日期功能

**文件位置**: `frontend/src/pages/TodoPage.jsx`

### 任务2: 实现用户注册登录页面
**目标**: 创建用户认证界面

**要求**:
- 登录/注册表单
- 表单验证
- 错误处理
- 自动跳转

**文件位置**: `frontend/src/pages/AuthPage.jsx`

### 任务3: 添加文件上传功能
**目标**: 实现头像上传功能

**要求**:
- 后端文件上传接口
- 前端文件选择组件
- 图片预览功能
- 文件类型验证

**文件位置**: 
- `server/routes/upload.js`
- `frontend/src/components/FileUpload.jsx`

### 任务4: 实现实时通知
**目标**: 使用WebSocket实现实时功能

**要求**:
- Socket.io集成
- 实时todo更新
- 在线用户状态
- 消息推送

**文件位置**:
- `server/socket.js`
- `frontend/src/hooks/useSocket.js`

### 任务5: 数据可视化
**目标**: 添加统计图表

**要求**:
- 使用Chart.js或ECharts
- Todo完成率统计
- 时间趋势分析
- 响应式图表

**文件位置**: `frontend/src/pages/DashboardPage.jsx`

## 🔧 开发工具推荐

### VS Code插件
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

### Chrome插件
- React Developer Tools
- Redux DevTools
- JSON Viewer

## 📝 代码规范

### 前端规范
```javascript
// 组件命名：PascalCase
const TodoItem = () => {
  // Hook在组件顶部
  const [loading, setLoading] = useState(false);
  
  // 事件处理函数：handle开头
  const handleSubmit = () => {
    // 实现逻辑
  };
  
  return (
    <div className="todo-item">
      {/* JSX内容 */}
    </div>
  );
};
```

### 后端规范
```javascript
// 路由处理：async/await
router.get('/todos', async (req, res) => {
  try {
    // 业务逻辑
    const todos = await todoModel.findAll();
    res.json(todos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## 🐛 常见问题

### 1. CORS错误
**问题**: 前端无法访问后端API
**解决**: 检查后端cors配置，确保允许前端域名

### 2. JWT Token过期
**问题**: 用户需要重新登录
**解决**: 实现token刷新机制

### 3. MongoDB连接失败
**问题**: 数据库连接错误
**解决**: 检查.env文件中的数据库连接字符串

## 📈 性能优化建议

### 前端优化
- 使用React.memo避免不必要的重渲染
- 实现虚拟滚动处理大量数据
- 使用懒加载优化首屏加载
- 合理使用useCallback和useMemo

### 后端优化
- 添加数据库索引
- 实现API缓存
- 使用连接池管理数据库连接
- 添加请求限流

## 🎓 学习资源

### 官方文档
- [React官方文档](https://react.dev/)
- [Express.js文档](https://expressjs.com/)
- [MongoDB文档](https://docs.mongodb.com/)

### 推荐教程
- React Hooks深入理解
- Node.js最佳实践
- MongoDB性能优化

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -m 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 创建Pull Request

---

**开始你的全栈开发学习之旅！** 🚀

记住：编程是一个持续学习的过程，不要害怕犯错，每个错误都是学习的机会。