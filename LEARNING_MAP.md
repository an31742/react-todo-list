# 项目架构学习地图

## 一句话概括

```
User 操作页面 → React 组件 → Redux → Axios API → Express 路由 → MongoDB → 返回数据 → 更新页面
```

---

## 分层架构图

```
┌─────────────────────────────────────────────────────────────┐
│                   前端 (frontend/)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │→ │Componen- │→ │  Redux   │→ │ Services │   │
│  │ 页面组件  │  │ts 通用组件│  │ 状态管理  │  │ API 封装 │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       │              │              │              │        │
│       ▼              ▼              ▼              ▼        │
│  react-router    Ant Design    @reduxjs/       axios       │
│  路由控制          UI 组件库    toolkit                      │
└─────────────────────────────────────────────────────────────┘
                              │  HTTP (proxy)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   后端 (server/)                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │→ │ Middleware│→ │   CRUD   │→ │ MongoDB  │   │
│  │  API路由  │  │  中间件   │  │  数据操作  │  │  数据库   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       │                           │                         │
│       ▼                           ▼                         │
│  Express 5                   原生 MongoDB 驱动               │
└─────────────────────────────────────────────────────────────┘
```

---

## 逐个文件解剖

### 一、后端（server/）— 从入口到数据库

#### 入口文件

**`server/app.js`**（~170 行）— **整个后端的大脑**
```
做的事：注册中间件 → 挂载路由 → 启动服务器
重要行：
  • 24-33   CORS 配置 — 允许哪些前端域名访问
  • 58-63   日志中间件 — 记录每次请求
  • 66-73   挂载路由 — app.use('/api/tasks', tasksRouter)
  • 151-168 启动方式 — Vercel vs 本地（两套逻辑）
```

#### 数据操作层（MongoDB）

**`server/mongoDb/db.js`**（~60 行）— **数据库连接器**
```
作用：连接 MongoDB，返回 db 实例
关键函数：
  • connectToDatabase() — 惰性连接（第一次调用才连）
  • 连接池 maxPoolSize: 10 — 最多 10 个并发连接
```

**`server/mongoDb/taskCRUD.js`**（~140 行）— **任务数据操作类**
```
作用：封装所有 tasks 集合的数据库操作
关键方法：
  • findTasks()  → 查询 + 按 order 排序
  • createTask() → 创建 + 自动算出 order
  • updateTask() → 更新 + 跨列时自动分配 order（见 Day 3 修复）
  • deleteTask() → 删除 + 重整同列 order（见 Day 3 修复）
  • reorderTasks() → 核心！同列/跨列重排序算法
```

#### API 路由层

**`server/routes/tasks.js`**（~90 行）— **任务 API**
```
路由注册顺序重要！第 30 行 /reorder 必须放在第 46 行 /:id 之前
  • GET    /api/tasks             → 查
  • POST   /api/tasks             → 建
  • PUT    /api/tasks/reorder     → 排（先注册，避免被 :id 吃掉）
  • PUT    /api/tasks/:id         → 改
  • DELETE /api/tasks/:id         → 删
每个 handler 的固定模式：
  try { new TaskCRUD().init() → 调方法 → res.json() }
  catch { res.status(500).json({ error }) }
```

**`server/routes/auth.js`** — **认证路由（内存存储）**
```
  • POST /api/auth/register — 注册
  • POST /api/auth/login    — 登录
  • GET  /api/auth/profile  — 取用户信息
当前存在内存里，重启丢失。这是下一步可以迁移到 MongoDB 的候选
```

### 二、前端（frontend/）— 从入口到页面

#### 入口

**`frontend/src/index.js`**（~10 行）
```
ReactDOM.createRoot → <BrowserRouter> → <App />
BrowserRouter 提供 URL 路由能力
```

**`frontend/src/App.js`**（~330 行）— **前端大脑**
```
做了 4 件事：
  1. 菜单配置（第 43-79 行）— 哪些菜单项，需要什么权限
  2. 权限控制（第 81-114 行）— hasPermission / filterMenuByRole
  3. 路由定义（第 306-320 行）— URL 对应哪个页面组件
  4. 整体布局（第 262-326 行）— Sider + Header + Content 结构
```

#### 状态管理层（Redux）

**`frontend/src/store/index.js`**（~10 行）
```
configureStore({ reducer: { tasks: taskSlice } })
```

**`frontend/src/store/taskSlice.js`**（~100 行）— **任务 Redux 状态**
```
三部分：
  1. createAsyncThunk（第 5-60 行）— 异步 API 调用
     fetchTasks → GET
     createTaskAsync → POST
     updateTaskAsync → PUT
     deleteTaskAsync → DELETE
     reorderTaskAsync → PUT /reorder
  2. initialState（第 66-69 行）— 初始状态 { tasks: [], loading: false }
  3. extraReducers（第 74-109 行）— 状态机
     pending  → loading = true
     fulfilled → 更新 tasks / loading = false
     rejected → loading = false
```

#### 服务层（API 封装）

**`frontend/src/services/api.js`** — **Axios 实例**
```
  • 请求拦截器：自动附带 Bearer token
  • 响应拦截器：401 时跳转到 /login
```

**`frontend/src/services/todoService.js`** — **Todo API 封装**

#### 页面组件

**`frontend/src/pages/CollaborativeBoard.jsx`**（~190 行）— **看板页面**
```
数据流：
  1. useEffect → dispatch(fetchTasks()) 加载数据
  2. useSelector(state.tasks) 拿到 Redux 里的数据
  3. 渲染三个 TaskColumn（todo / inProgress / done）
  4. 用户拖拽 → handleTaskMove（跨列）/ handleReorder（同列）
  5. 调 dispatch 发 API → 成功后 refetch → 页面更新
```

#### 通用组件

**`frontend/src/components/TaskColumn.jsx`**（~110 行）— **看板列容器**
```
  • useDrop 只接受跨列拖拽（canDrop: item.status !== status）
  • 渲染该列所有 TaskCard
  • 传递回调函数给 TaskCard
```

**`frontend/src/components/TaskCard.jsx`**（~100 行）— **任务卡片（核心）**
```
双 role：
  1. useDrag — 拖拽源，item = { id, status }
  2. useDrop — 拖拽目标（只接受同列）
     hover → getBoundingClientRect() 判断上/下半 → setHoverDir
     drop  → 算 targetIndex → onReorder
  3. drag(drop(ref)) — 关键！一个 DOM 绑两个 role
```

**`frontend/src/components/TaskForm.jsx`**（~100 行）— **新建/编辑任务弹窗**
```
  • Ant Design Modal + Form
  • visible / task / onSave / onCancel 由父组件控制
```

### 三、关键数据流

#### 拖拽流程

```
① User 拖卡片
  ↓
② TaskCard.useDrag → 设置 item = { id: "xxx", status: "todo" }
  ↓
③ 如果悬停在 不同列 → TaskColumn.useDrop 触发
    → handleTaskMove(taskId, "inProgress")
    → dispatch(updateTaskAsync({ id, updates: { status } }))
    → PUT /api/tasks/:id → 后端更新 status + 自动分配 order
    → 前端 Redux 更新
  ↓
④ 如果悬停在 同列不同位置 → TaskCard.useDrop 触发
    → 用 getBoundingClientRect 判断插入位置
    → handleReorder(taskId, targetIndex, "todo")
    → dispatch(reorderTaskAsync({ taskId, targetIndex, targetStatus }))
    → PUT /api/tasks/reorder → 后端 bulkWrite 重整 order
    → 成功后 dispatch(fetchTasks()) 重新拉取
```

#### 数据格式

```
MongoDB 文档 → JSON 序列化 → Axios 响应 → Redux state → React props
                                      ↓
                              _id: "657f1f77bcf86cd799439011" (字符串)
```

---

## 推荐学习顺序

按箭头方向读，每一步理解"输入 → 处理 → 输出"：

```
第一阶段：理解后端
  server/app.js          → 入口和路由挂载
  server/routes/tasks.js → API 长什么样
  server/mongoDb/db.js   → 数据库怎么连
  server/mongoDb/taskCRUD.js → 数据怎么操作 + reorder 算法

第二阶段：理解前端数据流
  frontend/src/store/taskSlice.js → Redux 怎么管理异步状态
  frontend/src/services/api.js    → API 怎么封装

第三阶段：理解页面渲染
  frontend/src/App.js             → 路由和菜单
  frontend/src/pages/CollaborativeBoard.jsx → 页面调度

第四阶段：理解拖拽核心
  frontend/src/components/TaskColumn.jsx → 列容器（跨列 drop）
  frontend/src/components/TaskCard.jsx   → 卡片（双 role 最核心）
```

每个阶段读完后，可以对着代码回答三个问题：
1. **这个文件的输入是什么？**（数据从哪里来）
2. **它做了什么处理？**（逻辑是什么）
3. **输出是什么？**（数据往哪里去）

---

## 下一步建议学的知识点

| 概念 | 在这个项目的体现 |
|------|----------------|
| Express 中间件链 | app.js 中 app.use() 的顺序就是请求经过的管道 |
| MongoDB 原生驱动 | taskCRUD.js 中 find/insertOne/updateOne/bulkWrite |
| Redux 异步流 | taskSlice.js 中 createAsyncThunk + extraReducers |
| React-dnd 后端 | HTML5Backend 是默认的鼠标/触摸事件适配层 |
| 乐观更新 | taskSlice.js 中在 API 返回前先更新本地状态 |
| 权限控制 | App.js 中 hasPermission + filterMenuByRole + Guard |

---

## 快速命令参考

```bash
pnpm dev              # 同时启动前后端
pnpm start:server     # 只启动后端 localhost:8899
pnpm start:frontend   # 只启动前端 localhost:3000
```
