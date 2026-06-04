## Day 11 React 线笔记：Commit 阶段

### 一、Commit 阶段的三个子阶段

Commit 阶段在 Render 阶段（递+归）完成后执行，负责将准备好的变更应用到真实 DOM。它同步执行、不可中断，依次经历三个子阶段：

| 顺序 | 子阶段 | 做什么 | 函数组件如何观察 |
|:---:|--------|--------|-----------------|
| ① | **BeforeMutation** | 执行上一次 `useLayoutEffect` 的清理函数，调度 `useEffect` 的清理 | `useLayoutEffect` 返回的清理函数在此执行 |
| ② | **Mutation** | 操作真实 DOM：插入、更新、删除节点；更新 ref | 不可直接观察，`MutationObserver` 微任务在此后触发 |
| ③ | **Layout** | 执行本次 `useLayoutEffect` 的新回调；此时 DOM 已更新，浏览器尚未绘制 | `useLayoutEffect` 回调在此同步执行，可读取最新 DOM 尺寸 |

---

### 二、完整执行顺序（与 Profiler 日志对应）

```
① BeforeMutation
  → 执行 useLayoutEffect 的清理函数

② Mutation
  → 真实 DOM 变动（新增/修改/删除节点）

③ Layout
  → 执行 useLayoutEffect 的新回调（同步读取 DOM）

（Commit 结束，浏览器绘制）

④ 异步阶段（不属于 Commit）
  → useEffect 的清理与回调在此执行
```

---

### 三、useLayoutEffect 与 useEffect 时机对比

| | useLayoutEffect | useEffect |
|------|------------------|------------|
| 清理执行阶段 | BeforeMutation | 异步（Commit 后） |
| 回调执行阶段 | Layout（同步，阻塞绘制） | 异步（浏览器绘制后） |
| 会阻塞页面绘制吗？ | ✅ 是 | ❌ 否 |
| 典型用途 | 同步读取/修改 DOM 布局 | 数据请求、事件订阅等 |

---

### 四、关键结论

- **Commit 阶段不可中断**：beforeMutation → mutation → layout 一次性同步完成，保证 UI 一致性。
- **Layout 阶段同步执行**：`useLayoutEffect` 回调在 DOM 更新后、浏览器绘制前运行，可安全读取尺寸，但过度使用会延迟绘制。
- **useEffect 异步执行**：在浏览器完成绘制后才运行，不影响首次渲染，绝大多数副作用应放在此处。
- **渲染与绘制分离**：Commit 阶段只更新 DOM，浏览器仍需样式计算、布局、绘制等步骤；`useLayoutEffect` 在绘制前，`useEffect` 在绘制后。

---

### 五、一句话记忆

> **Commit 三趟同步跑**：先清理上一次 layout 副作用，再动真实 DOM，最后执行本次 layout 回调。`useEffect` 则绘制后异步执行。