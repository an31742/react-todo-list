# Vercel 部署指南

## 📋 部署策略

本项目采用**前后端分离部署**模式，需要创建两个独立的 Vercel 项目。

## 🚀 快速开始

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 登录 Vercel

```bash
pnpm vercel-login
# 或直接运行
vercel login
```

### 3. 部署后端服务

#### 方式一：使用命令行（推荐）

```bash
# 进入 server 目录
cd server

# 部署到 Vercel
vercel --prod
```

#### 方式二：使用 Vercel Dashboard

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Add New Project"
3. 选择 "Import Git Repository"
4. 导入你的仓库
5. **重要配置**：
   - **Root Directory**: 点击 "Edit" 并设置为 `server`
   - **Framework Preset**: Node.js
   - **Build Command**: 留空
   - **Install Command**: `pnpm install`

### 4. 配置后端环境变量

在 Vercel Dashboard 中为后端项目添加以下环境变量：

- `MONGODB_URI`: MongoDB 连接字符串
- `DB_NAME`: 数据库名称
- `JWT_SECRET`: JWT 密钥
- `NODE_ENV`: `production`
- `PORT`: `8899`
- `FRONTEND_URL`: 前端应用 URL（部署前端后填写）

### 5. 部署前端应用

#### 方式一：使用命令行

```bash
# 进入 frontend 目录
cd frontend

# 部署到 Vercel
vercel --prod
```

#### 方式二：使用 Vercel Dashboard

1. 再次点击 "Add New Project"
2. 导入同一个仓库
3. **重要配置**：
   - **Root Directory**: 点击 "Edit" 并设置为 `frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `build`
   - **Install Command**: `pnpm install`

### 6. 配置前端环境变量

在 Vercel Dashboard 中为前端项目添加以下环境变量：

- `REACT_APP_API_URL`: 指向后端服务的 URL（步骤 3 中后端部署成功后获取）

### 7. 更新后端 CORS 配置

将后端的 `FRONTEND_URL` 环境变量更新为前端项目的 URL，然后重新部署后端。

## 🔐 数据库准备

### 使用 MongoDB Atlas（推荐）

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 创建免费集群
3. 配置网络访问：
   - 开发环境：临时允许 "Allow Access from Anywhere" (0.0.0.0/0)
   - 生产环境：添加 Vercel IP 白名单
     ```
     76.76.21.0/24
     76.76.22.0/24
     76.76.23.0/24
     ```
4. 创建数据库用户
5. 获取连接字符串

## ✅ 验证部署

### 1. 测试后端 API

```bash
# 替换为你的后端 URL
curl https://your-backend-url.vercel.app/api/tasks
```

### 2. 测试前端访问

在浏览器中访问前端 URL，确保：
- 页面正常加载
- 能够与后端 API 通信
- 无 CORS 错误

### 3. 检查浏览器控制台

打开浏览器开发者工具，确认：
- 无网络请求错误
- API 调用成功

## 🛡️ 安全最佳实践

### 凭证管理

- ✅ 使用环境变量存储敏感信息
- ✅ 不在代码库或配置文件中硬编码敏感数据
- ✅ 定期轮换密钥
- ✅ 为应用创建专用数据库用户

### CORS 配置

- ✅ 仅允许特定域名访问
- ✅ 不使用通配符 `*`
- ✅ 在 `.env` 中配置 `FRONTEND_URL`

## 📝 常用命令

```bash
# 本地开发
pnpm dev                    # 同时启动前后端
pnpm start:server          # 只启动后端
pnpm start:frontend        # 只启动前端

# Vercel 部署
pnpm vercel-login          # 登录 Vercel
pnpm deploy-backend        # 部署后端
pnpm deploy-frontend       # 部署前端
```

## 🔧 故障排查

### 问题：部署失败

**解决方案**：
1. 检查 `vercel.json` 配置是否正确
2. 确认 `package.json` 中的依赖完整
3. 查看 Vercel 部署日志

### 问题：CORS 错误

**解决方案**：
1. 检查后端 `FRONTEND_URL` 环境变量是否正确
2. 确认后端 CORS 中间件配置
3. 重新部署后端使环境变量生效

### 问题：数据库连接失败

**解决方案**：
1. 检查 `MONGODB_URI` 是否正确
2. 确认 MongoDB Atlas 网络访问配置
3. 检查 IP 白名单是否包含 Vercel IP

## 📚 参考资源

- [Vercel 官方文档](https://vercel.com/docs)
- [MongoDB Atlas 文档](https://www.mongodb.com/docs/atlas/)
- [Express.js 部署指南](https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production)

## ⚠️ 注意事项

1. **不要删除 `vercel.json`**：包含重要的部署配置
2. **环境变量修改后需重新部署**：在 Vercel Dashboard 中点击 "Redeploy"
3. **先部署后端再部署前端**：确保前端能正确配置 API URL
4. **使用 pnpm 而非 npm**：项目使用 pnpm workspace 管理
