# 🔐 安全配置指南

## 敏感文件管理

### ✅ 已配置的安全措施

1. **`.gitignore` 已更新**
   - 所有 `.env` 相关文件都被忽略
   - 包括：`.env`, `.env.local`, `*.env` 等
   - 凭证文件（`.pem`, `.key`）也被忽略

2. **示例文件已提供**
   - `server/.env.example` - 后端环境变量模板
   - 可以安全提交到 Git，不包含真实凭证

### 📋 本地开发配置步骤

1. **复制环境变量模板**
   ```bash
   cd server
   cp .env.example .env
   ```

2. **编辑 `.env` 文件**
   ```bash
   # server/.env
   MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/dbname'
   DB_NAME='your_database_name'
   JWT_SECRET='your-super-secret-jwt-key-at-least-64-chars'
   PORT=8899
   FRONTEND_URL='http://localhost:3000'
   ```

3. **验证 `.env` 不会被提交**
   ```bash
   git status
   # .env 文件应该显示为 "Untracked files"
   ```

### 🚀 Vercel 生产环境配置

#### 方式一：Vercel Dashboard（推荐）

1. **访问后端项目**
   - https://vercel.com/dashboard

2. **进入 Settings → Environment Variables**

3. **添加以下环境变量**：
   ```
   MONGODB_URI = mongodb+srv://...
   DB_NAME = your-db-name
   JWT_SECRET = <生成一个 64 字符的随机密钥>
   NODE_ENV = production
   PORT = 8899
   FRONTEND_URL = https://your-frontend.vercel.app
   ```

4. **重新部署**
   - Deployments → 选择最新部署 → Redeploy

#### 方式二：Vercel CLI

```bash
cd server

# 逐个添加环境变量
vercel env add MONGODB_URI
vercel env add DB_NAME
vercel env add JWT_SECRET
vercel env add NODE_ENV
vercel env add PORT
vercel env add FRONTEND_URL

# 部署项目
vercel --prod
```

### 🔑 生成安全的 JWT_SECRET

```bash
# 方法 1: 使用 OpenSSL
openssl rand -base64 64

# 方法 2: 使用 Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 方法 3: 在线生成
# https://generate-secret.vercel.app/32
```

### ✅ 安全检查清单

在提交代码前，请确认：

- [ ] `.env` 文件不在 Git 追踪中
- [ ] 使用 `.env.example` 作为模板
- [ ] 没有硬编码的密码或密钥
- [ ] `.gitignore` 包含所有敏感文件模式
- [ ] Vercel 环境变量已正确配置

### ⚠️ 如果意外提交了 `.env`

1. **立即撤销泄露的凭证**
   - 修改数据库密码
   - 重新生成 JWT_SECRET

2. **从 Git 历史中移除**
   ```bash
   # 从 Git 追踪中移除（保留本地文件）
   git rm --cached server/.env
   
   # 提交更改
   git commit -m "chore: remove .env from git tracking"
   
   # 强制推送到远程（谨慎使用）
   git push origin main --force
   ```

3. **更新 `.gitignore`**
   - 确保 `.env` 被加入忽略列表

4. **重新部署**
   - 在 Vercel 中重新部署项目

### 📚 相关文档

- [Vercel 环境变量文档](https://vercel.com/docs/environment-variables)
- [Git Ignore 官方文档](https://git-scm.com/docs/gitignore)
- [JWT 最佳实践](https://jwt.io/introduction)

---

**记住**: 永远不要将敏感信息提交到版本控制系统！
