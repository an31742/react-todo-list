# TodoPage 性能优化报告

> 日期：2026-05-31
> 项目：React Todo List

## 一、发现的性能问题

通过 React DevTools Profiler 录制发现：**点击一个 todo 的 checkbox 时，列表中所有 TodoItem 都重渲染了**。

### 问题复现步骤

1. 打开 TodoPage（列表有 3 条数据）
2. F12 → Profiler → 开始录制 🔴
3. 点击第一条 todo 的 checkbox
4. 停止录制 ⏹

### 优化前火焰图

| 组件 | 渲染次数 | 说明 |
|------|---------|------|
| TodoPage | ✅ 1 次 | 父组件 state 变化，必然渲染 |
| TodoItem#1 | ✅ 1 次 | 它自己的数据变了（completed），合理 |
| TodoItem#2 | ❌ 1 次 | **不该渲染——数据没变** |
| TodoItem#3 | ❌ 1 次 | **不该渲染——数据没变** |

**根因分析：** React 的默认行为是"父渲染 → 所有子渲染"。列表中有 N 个 todo，更新任何一个都会导致全部 N 个 TodoItem 重新执行。

```
点击 checkbox
  → setTodos()
  → TodoPage 重渲染
  → 3 个 TodoItem 全部重渲染（浪费 2/3）
```

### Profiler 截图

![alt text](../image.png)

---

## 二、优化方案

### 修改 1：TodoItem 加 React.memo

```jsx
const TodoItem = React.memo(function TodoItem({ todo, ... }) {
  // ...
});
```

**作用：** React.memo 浅比较 props，发现 `todo` 对象的引用没变时跳过渲染。

### 修改 2：回调函数加 useCallback

```jsx
const toggleTodo = useCallback(async (id) => {
  const todo = todosRef.current.find(t => t.id === id);
  // ...
}, []); // 依赖 []，引用永远不变

const deleteTodo = useCallback(async (id) => {
  // ...
}, []);
```

**作用：** 保证每次渲染传给 TodoItem 的 `onToggle`、`onDelete` 等 props 引用不变。
**如果不加：** 即使有 React.memo，新创建的函数会导致浅比较失败，优化失效。

### 修改 3：setTodos 改用函数式更新

```jsx
// 优化前
setTodos(todos.map(...))  // 依赖外部 todos

// 优化后
setTodos(prev => prev.map(...))  // 不需要外部 todos
```

**作用：** 让 useCallback 的依赖数组可以为 `[]`，引用永远不变。

---

## 三、优化效果对比

### 操作：点击 checkbox

| | 优化前 | 优化后 |
|--|-------|-------|
| 渲染的 TodoItem 数量 | 3 个（全部） | 1 个（仅被点击的） |
| 多余渲染 | 2 个 | 0 个 |
| 渲染耗时 | <!-- 填写优化前 ms --> | <!-- 填写优化后 ms --> |

### 操作：点击编辑按钮

| | 优化前 | 优化后 |
|--|-------|-------|
| 渲染的 TodoItem 数量 | 3 个（全部） | <!-- 看 Profiler 结果 --> |
| 多余渲染 | 2 个 | |

![alt text](../image-1.png)

---

## 四、技术总结

### 理解链路

```
useCallback 稳定函数引用
  → React.memo 浅比较通过
    → 子组件跳过渲染
      → 性能提升
```

### 关键认知

- **`React.memo` 不是免费的**——每次渲染都要做一次浅比较，组件足够轻量时不如不用
- **`useCallback` 必须配 `React.memo`**——子组件不包 memo，父渲染子必渲染，useCallback 白用
- **函数式更新配合 `useCallback([])`**——用 `prev => ...` 替代外部变量，让依赖数组可以为空

### 适用场景

| 场景 | 建议 |
|------|------|
| 列表项 > 10 条，操作频繁 | ✅ 强烈建议优化 |
| 列表项很少（≤3），操作不频繁 | ⚠️ 优化收益有限 |
| 列表项渲染很重（复杂图表） | ✅ 必须优化 |
| 子组件非常轻量（一个 div） | ❌ 不需要，memo 比较开销反而更大 |

---

## 五、后续优化方向

- [ ] `filter` 按钮组件也可以包 React.memo（当前每次切换 filter 时按钮也重渲染）
- [ ] `addTodo` 依赖 `newTodo`，打字时引用变化 → 影响了其他 TodoItem 的 props 对比
- [ ] 考虑用 `useDeferredValue` 优化大量数据下的列表渲染
