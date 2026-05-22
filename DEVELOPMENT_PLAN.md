# 开发计划：看板拖拽持久化 + MongoDB 迁移

## 学习目标

- **React 核心**：react-dnd 深入（drag source + drop target 组合）、Redux Toolkit 异步流、乐观更新
- **数据库**：MongoDB 原生驱动 CRUD、批量更新、排序字段设计
- **Express**：路由重构、MongoDB 集成模式、错误处理

---

## 总工期：3 天

> 全部完成 ✅

### 第 1 天 — 后端：内存 → MongoDB ✅

#### 任务 1.1：创建 `server/mongoDb/taskCRUD.js`
- 仿照 `BookCRUD` 模式，操作 `tasks` 集合
- 关键方法：`init()`, `findTasks(query)`, `createTask(data)`, `updateTask(id, data)`, `deleteTask(id)`
- 新增方法：`reorderTasks(taskId, targetIndex, targetStatus)` — 处理列内/跨列排序
- 新增字段 `order`（Number），用于列内排序

#### 任务 1.2：重写 `server/routes/tasks.js`
- 内存数组 `let tasks = [...]` → MongoDB 数据库操作
- `GET /api/tasks` — 从数据库按 `projectId` 筛选 + 按 `order` 排序
- `POST /api/tasks` — 插入新任务，自动计算 order（该列最后一个）
- `PUT /api/tasks/:id` — 更新单个任务（标题、描述、状态、优先级等）
- `PUT /api/tasks/reorder` — **新增**，接收 `{ taskId, targetIndex, targetStatus }`
  - 同列重排：调整当前列的 order
  - 跨列移动：移出旧列 → 插入新列 targetIndex 位置
- `DELETE /api/tasks/:id` — 从数据库删除

#### 任务 1.3：更新 `server/app.js`
- 不再依赖 Vercel 环境判断，tasks 路由始终可用
- 服务器启动时即可使用 MongoDB（已有配置）

### 第 2 天 — 前端：列内排序 ✅

#### 任务 2.1：TaskCard 同时成为 drop target
- 当前：TaskCard 只作为 `useDrag`（拖拽源）
- 改为：`useDrag` + `useDrop` 组合
- 同列 hover 时显示插入指示线（一条横线）
- 通过 `item.index` 和 monitor 判断是上方还是下方

#### 任务 2.2：TaskColumn 区分同列 vs 跨列
- 跨列：走现有 `onTaskMove` 逻辑
- 同列：调用新的 reorder API

#### 任务 2.3：Redux taskSlice 新增 reorder action
- 新增 `reorderTaskAsync` async thunk
- 乐观更新 + 失败回滚

### 第 3 天 — 收尾 & 学习总结 ✅

完成情况：
- 边界处理：删除重整 order、跨列移动自动分配 order、快速连续拖拽加锁
- 测试数据清理：删除旧测试数据，插入 6 条有意义的示例数据
- 数据流：创建 → 跨列拖拽 → 同列重排 → 刷新持久化，全链路验证通过

学习要点：
1. **React-dnd 双 role 模式** — `drag(drop(ref))` 链式连接
2. **MongoDB bulkWrite** — 批量更新 order 保证原子性
3. **Express 路由顺序** — 具体路径必须在动态参数前注册
4. **Redux 异步状态机** — pending / fulfilled / rejected 三态

> 项目运行：后端 `localhost:8899`，前端 `localhost:3001`
> 6 条示例数据已初始化到 MongoDB

#### 任务 3.1：清理 Socket.IO 前端代码
- 删除 `CollaborativeBoard.jsx` 中的 socket 引用
- 删除 `taskSlice.js` 中的 `realTimeTaskUpdate`、`updateOnlineUsers` 等 socket 相关 reducer
- 删除在线用户显示区域

#### 任务 3.2：完整流程测试
- 启动项目，验证：创建 → 跨列拖拽 → 同列重排 → 刷新持久化
- 边界情况：拖到空列、快速连续拖拽、删除后重排

#### 任务 3.3：学习回顾
- React-dnd 核心原理：backend、DragSource、DropTarget、monitor
- MongoDB 原子更新操作：`updateOne`、`bulkWrite`
- Redux 异步流：createAsyncThunk → extraReducers 状态机

---

## 数据模型

```json
{
  "_id": ObjectId,
  "title": "设计UI界面",
  "description": "完成用户界面设计",
  "status": "todo",         // todo | inProgress | done
  "priority": "high",       // high | medium | low
  "assignee": {
    "id": "1",
    "name": "Alice",
    "avatar": ""
  },
  "projectId": "project1",
  "order": 0,               // 列内排序，同一列从 0 开始递增
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

## API 设计

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/tasks?projectId=xxx | 获取任务列表，按 order 排序 |
| POST | /api/tasks | 创建新任务 |
| PUT | /api/tasks/:id | 更新单个任务 |
| PUT | /api/tasks/reorder | 重排序（核心） |
| DELETE | /api/tasks/:id | 删除任务 |

### reorder 请求体

```json
{
  "taskId": "abc123",
  "targetIndex": 2,
  "targetStatus": "inProgress"
}
```

后端逻辑：
1. 获取要移动的任务
2. 获取目标列所有任务按 order 排序
3. 分两种情况：
   - **同列重排**：从原位置移除，插入 targetIndex
   - **跨列移动**：从旧列移除，调整旧列 order；插入新列 targetIndex，调整新列 order
4. 批量更新所有受影响的 order

---

## 前端组件改动

| 组件 | 改动 |
|------|------|
| TaskCard.jsx | 新增 `useDrop`，显示插入指示线 |
| TaskColumn.jsx | 传给 TaskCard 新的 props（状态、索引、同列移动回调） |
| CollaborativeBoard.jsx | 删除 socket 代码，新增 reorder handler |
| taskSlice.js | 新增 reorderTaskAsync，删除 socket reducers |

## 如何运行

```bash
# 终端 1：启动后端（端口 8899）
pnpm start:server

# 终端 2：启动前端（端口 3000）
pnpm start:frontend

# 或者一起启动
pnpm dev
```

后端依赖 MongoDB 连接，确保 `.env` 中 `MONGODB_URI` 有效。
