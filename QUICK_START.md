# 🚀 在 Vercel 上创建项目 - 快速开始

## 方式一：使用自动化脚本（推荐）

### macOS / Linux

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 运行部署脚本
./deploy.sh all
```

### Windows

```cmd
REM 1. 安装 Vercel CLI
npm install -g vercel

REM 2. 运行部署脚本
deploy.bat all
```

## 方式二：手动部署（逐步指导）

### 步骤 1: 准备工作

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login
```

### 步骤 2: 部署后端服务

```bash
# 进入 server 目录
cd server

# 部署到 Vercel
vercel --prod
```

**记录生成的 URL**，例如：`https://your-backend.vercel.app`

### 步骤 3: 配置后端环境变量

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到刚部署的后端项目
3. 点击 "Settings" → "Environment Variables"
4. 添加以下变量：
   ```
   MONGODB_URI=<你的 MongoDB 连接字符串>
   DB_NAME=<你的数据库名称>
   JWT_SECRET=<你的密钥>
   NODE_ENV=production
   PORT=8899
   ```
5. 点击 "Redeploy" 使环境变量生效

### 步骤 4: 部署前端应用

```bash
# 返回项目根目录
cd ..

# 进入 frontend 目录
cd frontend

# 部署到 Vercel
vercel --prod
```

**记录生成的 URL**，例如：`https://your-frontend.vercel.app`

### 步骤 5: 配置前端环境变量

1. 在 Vercel Dashboard 中找到前端项目
2. 点击 "Settings" → "Environment Variables"
3. 添加变量：
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app
   ```
   （使用步骤 3 中记录的后端 URL）
4. 点击 "Redeploy" 使环境变量生效

### 步骤 6: 更新后端 CORS 配置

1. 回到后端项目的环境变量设置
2. 添加变量：
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
   （使用步骤 4 中记录的前端 URL）
3. 点击 "Redeploy" 使环境变量生效

## ✅ 验证部署

访问前端 URL，测试功能是否正常：
```
https://your-frontend.vercel.app
```

## 🔧 常见问题

### Q: 如何重新部署？

```bash
# 部署后端
cd server
vercel --prod

# 部署前端
cd frontend
vercel --prod
```

### Q: 如何查看部署日志？

在 Vercel Dashboard 中点击对应项目，选择 "Deployments" 标签页，点击最新的部署记录查看日志。

### Q: 如何修改环境变量？

1. 访问 Vercel Dashboard
2. 选择对应项目
3. Settings → Environment Variables
4. 编辑/添加/删除变量
5. 点击 "Redeploy" 使更改生效

## 📱 移动端部署

如果你需要在移动设备上操作，可以直接访问 [Vercel Dashboard](https://vercel.com/dashboard) 进行可视化部署。

---

**详细文档**: 查看 [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md) 获取完整部署指南。
