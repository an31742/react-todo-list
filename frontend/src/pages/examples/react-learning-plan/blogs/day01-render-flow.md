# Day 1：React Render 流程——一个 setState 后到底发生了什么？

> 系列：React 从"会用"到"能讲"
> 日期：2026-05-26

## 一句话总结

**调用 `setState` → 组件函数重新执行 → 生成新 JSX → 虚拟 DOM Diff → 提交到真实 DOM。**

---

## 一、问题：为什么我改了 state，页面就变了？

写 React 时我们每天都在做这件事：

```jsx
const [count, setCount] = useState(0);
// 点击按钮时：
setCount(count + 1);
```

页面上的数字就更新了。但 `setCount` 背后到底做了什么？

以前我的回答是："呃…React 重新渲染了？" 但再问"怎么重新渲染的？"就卡住了。

## 二、实验：给每个组件加上"监控"

```jsx
function TodoPage() {
  console.log('📦 TodoPage 渲染');
  // ...
  return (
    <div>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

function TodoItem({ todo }) {
  console.log(`  📋 TodoItem 渲染: ${todo.id}`);
  return <div>{todo.title}</div>;
}
```

打开控制台，点了一下"添加待办"，打印结果是：

```
📦 TodoPage 渲染
  📋 TodoItem 渲染: 1
  📋 TodoItem 渲染: 2
  📋 TodoItem 渲染: 3
```

**关键观察：** 我明明只加了一条数据，但**所有 TodoItem 都重新渲染了**。这就是 React 的默认行为——父组件重新执行，所有子组件也重新执行。

## 三、整条链路拆解

```
用户点击按钮
  → setCount(count + 1)    ← 触发更新
    → React 把这次更新加入队列
      → 重新执行组件函数    ← 函数体从头到尾跑一遍
        → 生成新的 JSX      ← React.createElement 调用
          → 新旧虚拟 DOM 比较（Diff）
            → 找出需要更新的节点
              → 提交到真实 DOM
```

### 关键点 1：组件函数每次都会"重头跑一遍"

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const doubled = count * 2;          // 这行每次都会重新执行
  console.log('我被执行了');           // 这行每次都会打印

  return <div>{doubled}</div>;
}
```

不只是 JSX 部分，**整个函数体**每次都重新执行。这也是为什么 `useMemo` 有用——它能在函数重新执行时，跳过某些耗时的计算。

### 关键点 2：虚拟 DOM 比较

React 没有直接操作 DOM。它先生成一个 JS 对象树（虚拟 DOM），然后和上一次的树比较：

```js
// 上一次的虚拟 DOM
{ type: 'div', props: { className: 'counter' }, children: ['0'] }

// 这次的虚拟 DOM（count 变成 1 了）
{ type: 'div', props: { className: 'counter' }, children: ['1'] }

// Diff 发现：children 从 '0' 变成了 '1'
// → 只更新这个文本节点，不重新创建整个 div
```

这就是 React 高效的原因——**不直接操作 DOM，而是先算出差异再精准更新**。

## 四、画一张流程图

```
┌─────────────────────────────┐
│        用户交互              │
│  点击按钮 / 输入文字 / API   │
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│      setState() 调用         │
│   React 加入更新队列          │
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│   组件函数重新执行（全量）     │
│   - 所有 hooks 重新调用       │
│   - 所有变量重新计算          │
│   - 生成新 JSX               │
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│   虚拟 DOM Diff 比较          │
│   - 比较新旧两棵虚拟 DOM 树   │
│   - 找出最小的变更集合         │
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│    提交到真实 DOM             │
│   只更新变更的部分             │
└─────────────────────────────┘
```

## 五、为什么理解这个很重要？

| 如果不理解 | 你会遇到的问题 |
|-----------|--------------|
| 组件函数每次重头执行 | 以为变量定义一次后就保持不变 |
| 子组件跟随父组件渲染 | 列表一大就卡顿，不知道为什么 |
| 虚拟 DOM Diff | 以为 `key={index}` 没问题，直到出现诡异 bug |

**理解了渲染链路，才能真正理解 useMemo、useCallback、React.memo 的作用——它们不是在"阻止渲染"，而是在"控制渲染链路中的某些环节"。**

## 六、自己动手验证

1. 打开你的项目，在每个组件函数第一行加 `console.log('组件名 渲染')`
2. 操作页面，观察哪些组件在什么时候重新渲染了
3. 试着画一张你自己的渲染链路图

---

**下一篇：** [Day 2：Hooks 链表——为什么 hooks 不能写在 if 里](day02-hooks-chain.md)
