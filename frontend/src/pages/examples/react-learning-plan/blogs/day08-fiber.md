# Fiber 架构核心理解

### 一、React 为什么要引入 Fiber？

**解决的问题**：React 15 及之前采用递归渲染，一旦开始更新，必须等整棵组件树全部处理完毕，浏览器才能响应用户输入，复杂页面会出现明显卡顿。

**Fiber 的改进**：将**递归不可中断**的渲染改为**链表循环可中断**的遍历，让渲染工作可以被切分、暂停和恢复。

---

### 二、Fiber 节点的三个关键指针

| 指针 | 指向 | 作用 |
|------|------|------|
| `child` | 第一个子节点 | 向下遍历 |
| `sibling` | 下一个兄弟节点 | 横向遍历 |
| `return` | 父节点 | 向上回溯，收集副作用 |

这三个指针把树形结构转成了**单向链表**，使得 React 可以用 `while` 循环实现深度优先遍历，并且可以在任意节点暂停/恢复。

---

### 三、Fiber 树遍历顺序（以我的 Todo 项目为例）

```
App
├── Guard
├── TodoPage
│   ├── TodoItem (id=1)
│   ├── TodoItem (id=2)
```

**遍历顺序**：`App → Guard → TodoPage → TodoItem(1) → TodoItem(2)`

**验证**：在控制台打印出的日志与遍历顺序完全一致，说明 React 在 Render 阶段按照 Fiber 链表顺序（child → sibling → return）深度优先遍历组件树，逐个执行组件函数。

---

### 四、Fiber 树的遍历方式：旧 vs 新

**默认行为**：每次渲染，React 都会从根节点遍历整棵 Fiber 树，走遍所有子组件。

| | React 15（旧） | React 16+（Fiber） |
|------|------|------|
| 遍历方式 | 函数递归调用 | 链表循环遍历 |
| 能否中断 | ❌ 不能，必须走完 | ✅ 每处理一个节点可暂停 |
| 遍历过程 | 调用栈深 | 循环引用 next 指针 |

**本质区别（代码对比）**：

```js
// React 15：递归调用，不能停
function render(component) {
  const dom = createDom(component);
  for (let child of component.children) {
    render(child); // 递归调用，占满调用栈
  }
}

// Fiber：链表循环，每步可停
function workLoop(deadline) {
  while (nextFiber && deadline.timeRemaining() > 1) {
    nextFiber = performUnitOfWork(nextFiber); // 处理一个节点，返回下一个
  }
  if (nextFiber) requestIdleCallback(workLoop); // 时间不够，下一帧继续
}
```

**关键认知**：Fiber 不是"减少了遍历"，而是"改变了遍历方式"——用链表循环替代递归，中间可以暂停去响应更高优先级的事情（如用户点击、动画）。

**那如何"减少遍历"？靠 `React.memo`**：

- 没有 `React.memo`：每次渲染，全部子组件都重新执行
- 有 `React.memo`（且 props 没变）：Fiber 依然会经过这些节点，但检查到 props 没变后**跳过组件函数执行，直接复用上一次结果**

---

### 五、时间切片

**定义**：把一大段连续的工作，切成很多个小片段，每个片段只执行一小段时间（如 5ms），然后主动交出控制权给浏览器。

**工作方式**：React 每处理完一个 Fiber 节点就检查一次——浏览器是否还有其他任务？如果有就让路，等下次空闲继续。

**作用**：确保长任务不阻塞用户交互。

---

### 六、双缓冲

React 内部同时维护两棵 Fiber 树：

| 树 | 作用 |
|------|------|
| `current` | 屏幕上当前显示的树 |
| `workInProgress` | 内存中正在构建的新树 |

**工作流程**：
1. 当前页面由 `current` 树渲染展示
2. 当有变化时，React 在 `workInProgress` 树上处理变化
3. 新树完全构建结束后，`current` 和 `workInProgress` 身份互换
4. `workInProgress` 变成新的 `current`，页面完成更新

**一句话**：**当前页面有一颗渲染树展示，后台有一颗新树处理变化，新树构建完成即替换旧树。**

---

### 七、两阶段：递与归

| 阶段 | 英文 | 做什么 | 是否可中断 |
|------|------|--------|------------|
| 递阶段 | BeginWork | 从上到下，生成子 Fiber 节点 | ✅ 可中断 |
| 归阶段 | CompleteWork | 从下到上，收集副作用（effect），对原生标签创建/更新 DOM | — |

**递生成结构，归收集操作，Commit 统一执行。**

---

### 八、整体总结

> React 把组件树转换成 Fiber 链表树，通过时间切片让遍历可中断。调度器（Scheduler）负责判断浏览器有没有空闲，有空就处理下一个 Fiber 节点。处理过程中用 Diff 算法对比新旧节点，标记需要更新的地方。整个构建过程在内存中的新树（workInProgress）上进行，旧树（current）继续展示在屏幕上。等新树构建完成，Commit 阶段一次性替换旧树和真实 DOM。

**流程图**：
```
页面需要更新
    │
    ▼
Scheduler（调度器）
    │ 判断浏览器有没有空闲
    │ 有空就分配给 Reconciler
    ▼
Reconciler（协调器 = Diff + Fiber 遍历）
    │ 对比新旧节点，标记变更
    │ 在 workInProgress 树上工作
    │ 利用时间切片，每个节点处理完检查是否要继续
    ▼
Commit 阶段
    │ 一次性更新真实 DOM
    │ workInProgress 变成 current
    ▼
浏览器绘制新画面
```

**一句话记忆**：
> **双缓冲让画面不闪，时间切片让交互不卡，Diff 决定改哪里，调度器决定什么时候改。**

