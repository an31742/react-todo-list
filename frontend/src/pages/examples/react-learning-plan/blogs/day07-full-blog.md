# React 渲染到底发生了什么——从 Profiler 到优化实战

> 作者：an31742
> 日期：2026-05-31
> 系列：React 从"会用"到"能讲"

---

## 写在前面

如果你能开发 React 项目，但被问到下面这些问题会卡住：

- "一个 `setState` 后到底发生了什么？"
- "为什么 hooks 不能写在 `if` 里？"
- "`useEffect` 为什么会死循环？"
- "`useMemo` 和 `useCallback` 到底是干嘛的？"

那这篇文章就是为你写的。本文不讲源码，**全部用自己的项目的实际操作来验证**每个概念。

---

## 目录

1. [React Render 流程——一个 setState 后发生了什么](#一react-render-流程一个-setstate-后发生了什么)
2. [Hooks 链表——为什么 hooks 不能写在 if 里](#二hooks-链表为什么-hooks-不能写在-if-里)
3. [useEffect 死循环与 cleanup](#三useeffect-死循环与-cleanup)
4. [useRef——不触发渲染的"变量保险箱"](#四useref不触发渲染的变量保险箱)
5. [useMemo & useCallback & React.memo——性能优化三件套](#五usememo--usecallback--reactmemo性能优化三件套)
6. [实战：用 Profiler 验证优化效果](#六实战用-profiler-验证优化效果)
7. [总结](#七总结)

---

## 一、React Render 流程——一个 setState 后发生了什么

### 一句话

**调用 `setState` → 组件函数重新执行 → 生成新 JSX → 虚拟 DOM Diff → 提交到真实 DOM。**

### 实验：给每个组件加上"监控"

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

打开控制台，点了一下"添加待办"：

```
📦 TodoPage 渲染
  📋 TodoItem 渲染: 1
  📋 TodoItem 渲染: 2
  📋 TodoItem 渲染: 3
```

**关键观察：** 我只加了一条数据，但**所有 TodoItem 都重新渲染了**。这就是 React 的默认行为——父组件重新执行，所有子组件也重新执行。

### 整条链路拆解

```
用户点击按钮
  → setCount(count + 1)         ← 触发更新
    → React 把更新加入队列
      → 重新执行组件函数         ← 函数体从头到尾跑一遍
        → 生成新的 JSX           ← React.createElement 调用
          → 新旧虚拟 DOM Diff 比较
            → 找出需要更新的节点
              → 提交到真实 DOM
```

### 关键点 1：组件函数每次都会"重头跑一遍"

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const doubled = count * 2;        // 这行每次都会重新执行
  console.log('我被执行了');         // 这行每次都会打印

  return <div>{doubled}</div>;
}
```

不只是 JSX 部分，**整个函数体**每次都重新执行。这也是为什么 `useMemo` 有用——它能在函数重新执行时，跳过某些耗时的计算。

### 关键点 2：虚拟 DOM 比较

React 没有直接操作 DOM。它先生成一个 JS 对象树（虚拟 DOM），然后和上一次的树比较：

```
上一次的虚拟 DOM：{ type: 'div', children: ['0'] }
这次的虚拟 DOM：  { type: 'div', children: ['1'] }

Diff 发现 children 变了 → 只更新这个文本节点
```

这就是 React 高效的原因——**不直接操作 DOM，而是先算出差异再精准更新**。

---

## 二、Hooks 链表——为什么 hooks 不能写在 if 里

### 一句话

**React 用链表来存储 hooks，每个 hooks 按调用顺序排队。写在 if 里会破坏顺序，导致 React 拿错数据。**

### 实验：故意写错，观察报错

```jsx
function BuggyComponent() {
  const [count, setCount] = useState(0);

  if (count > 0) {
    const [show, setShow] = useState(false); // ❌
  }

  const [text, setText] = useState('hello');

  return <div>{count}</div>;
}
```

第一次渲染（`count = 0`，if 不成立）：

```
hooks 调用顺序：useState(0) → useState('hello')
React 存储：    [第1个state] → [第2个state]
```

第二次渲染（`count = 1`，if 成立）：

```
hooks 调用顺序：useState(0) → useState(false) → useState('hello')
React 存储：    [第1个state] → [第2个state] → ？？？

// React：第2个 useState 对应的是 show？还是 text？乱了！
// → Uncaught Invariant Violation: Rendered fewer hooks than expected.
```

### 理解：Hooks 链表结构

React 内部不是用"变量名"来区分不同 hooks 的，而是用**顺序**：

```jsx
function Component() {
  const [a] = useState(1);    // hook #1
  const [b] = useState(2);    // hook #2
  useEffect(() => {}, []);    // hook #3
  const [c] = useState(3);    // hook #4
}
```

React 内部用链表存储：

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ hook #1  │ →  │ hook #2  │ →  │ hook #3  │ →  │ hook #4  │
│ state: 1 │    │ state: 2 │    │ effect   │    │ state: 3 │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

每次渲染时，React 只是从头遍历链表，依次取出数据。

**这和"变量名"完全无关。** 无论你的 useState 叫什么，React 只数"第几次调用"。

### 实际开发中的案例

```jsx
// ❌ 错误：提前 return 导致 hooks 不执行
function UserProfile({ user }) {
  const [name, setName] = useState('');
  if (!user) return <Loading />;            // 提前 return
  useEffect(() => { setName(user.name); }, [user]); // 后面的 hooks 没执行
}

// ✅ 正确：hooks 全在顶层
function UserProfile({ user }) {
  const [name, setName] = useState('');
  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);
  if (!user) return <Loading />;            // 条件渲染放在 hooks 之后
  return <div>{name}</div>;
}
```

---

## 三、useEffect 死循环与 cleanup

### 一句话

**useEffect 的死循环通常是因为依赖数组没写"所有被引用的变量"。cleanup 函数是 React 在组件卸载或 effect 重新执行前给你的"清理窗口"。**

### 死循环链路

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  setCount(count + 1);    // ❌ effect 里改了 state
}, [count]);               //  依赖了自己
```

```
组件挂载
  → useEffect 执行 → setCount(1)
    → 组件重渲染（count = 1）
      → 依赖 [count] 变化 → useEffect 重新执行
        → setCount(2)
          → 组件重渲染（count = 2）
            → 依赖 [count] 变化 → useEffect 重新执行
              → …… 无限循环
```

### 实验：错误计时器 → 修复

```jsx
// ❌ 错误：闭包陷阱 + 内存泄漏
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1);   // count 永远被闭包捕获为初始值
  }, 1000);
}, []);                      // 依赖为空 → 定时器只创建一次
```

`count` 被闭包捕获为 0，每隔 1 秒执行 `setCount(0 + 1)`。count 永远在 0→1→0→1 之间跳？不对——因为 `setCount(1)` 两次对同一个 state 设置相同值，React 会忽略。所以页面永远显示 1，但定时器还在跑——**内存泄漏了。**

```jsx
// ✅ 修复 1：函数式更新（不需要依赖 count）
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1);  // prev 永远是最新值
  }, 1000);
  return () => clearInterval(timer); // ✅ cleanup
}, []);

// ✅ 修复 2：把 count 放依赖（定时器每秒重建）
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(timer);
}, [count]); // ✅ 依赖 count，count 变化 → 清理旧定时器 → 创建新定时器
```

### 为什么 cleanup 重要？

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const conn = chat.connect(roomId);

    return () => {
      conn.disconnect();    // ✅ cleanup：组件卸载或 roomId 变化时断开旧连接
    };
  }, [roomId]);
}
```

组件生命周期：

```
挂载（roomId = "a"） → connect("a")
                               ↓
roomId → "b"          → cleanup: disconnect("a")
                      → connect("b")
                               ↓
roomId → "c"          → cleanup: disconnect("b")
                      → connect("c")
                               ↓
组件卸载               → cleanup: disconnect("c")    ✅ 干干净净
```

### 常见场景速查

| 场景 | cleanup 做什么 |
|------|--------------|
| 定时器 | `clearInterval(timer)` |
| 事件监听 | `removeEventListener(type, handler)` |
| API 请求 | 设置 `cancelled = true` 标记 |
| 订阅 | `unsubscribe()` |
| 动画帧 | `cancelAnimationFrame(id)` |

---

## 四、useRef——不触发渲染的"变量保险箱"

### 一句话

**useRef 创建一个在组件整个生命周期中都保持不变的"盒子"，修改它不会触发组件重渲染。**

### 实验：对比 useState 和 useRef

```jsx
function CompareDemo() {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  const handleStateClick = () => {
    setCount(count + 1);        // ✅ 页面更新
  };

  const handleRefClick = () => {
    countRef.current += 1;       // ✅ 值变了，但页面不变
    console.log('ref:', countRef.current);
  };

  return (
    <div>
      <p>useState: {count}</p>
      <p>useRef: {countRef.current}</p>
      <button onClick={handleStateClick}>useState +1</button>
      <button onClick={handleRefClick}>useRef +1</button>
    </div>
  );
}
```

| 操作 | useState 值 | useRef 值 | 组件重渲染？ |
|------|------------|----------|------------|
| 点 "useState +1" | 0 → 1 | 不变 | ✅ |
| 点 "useRef +1" | 不变 | 0 → 1 | ❌ |
| 点 "useRef +1" 多次 | 不变 | 1 → 2 → 3… | ❌ 一直没触发 |

### useRef 的三大用途

**用途 1：访问 DOM 元素**

```jsx
function AutoFocus() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();  // ✅ 挂载后自动聚焦
  }, []);

  return <input ref={inputRef} placeholder="自动聚焦" />;
}
```

**用途 2：保存可变值，不触发重渲染**

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  const start = () => {
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(timerRef.current);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={start}>开始</button>
      <button onClick={stop}>停止</button>
    </div>
  );
}
```

**用途 3：解决闭包陷阱（核心用法）**

```jsx
function AutoSave({ data }) {
  const dataRef = useRef(data);

  useEffect(() => { dataRef.current = data; });  // 同步最新值

  useEffect(() => {
    const timer = setInterval(() => {
      saveToServer(dataRef.current);  // ✅ 永远读取最新数据
    }, 30000);
    return () => clearInterval(timer);
  }, []);  // ✅ 依赖为空，定时器只创建一次
}
```

### useRef vs useState 选择指南

| 场景 | 用哪个 |
|------|--------|
| 值变了需要更新 UI | `useState` |
| 值变了但 UI 不用动 | `useRef` |
| 需要 DOM 元素 | `useRef` |
| 定时器 ID / 订阅句柄 | `useRef` |
| 解决闭包陷阱 | `useRef` + 每次渲染同步 |

---

## 五、useMemo & useCallback & React.memo——性能优化三件套

### 一句话

**useMemo 缓存计算结果，useCallback 缓存函数引用，React.memo 跳过子组件渲染。三者各司其职，配合才能真正减少不必要的渲染。**

> 很多人以为"useMemo 阻止了组件渲染"——**这是错的。** 它们只是提供稳定值/引用，让 React.memo 能生效。

### 先搞清楚关键认知

```
❌ 误解："用了 useMemo → 组件不渲染"

✅ 真相：
  useMemo    → 跳过「计算过程」，不是跳过组件渲染
  useCallback → 稳定「函数引用」，不是跳过组件渲染

  它们只是把"值"和"函数"稳住，
  让 React.memo（浅比较 props）能生效 → 子组件跳过渲染
```

| 工具 | 缓存什么 | 解决什么问题 | 需要配合谁 |
|------|---------|-------------|-----------|
| `useMemo` | 计算结果 | "计算太慢，输入没变" | —（自己用） |
| `useCallback` | 函数引用 | "函数每次新建，子组件 props 总变" | `React.memo` |
| `React.memo` | 组件渲染 | "props 没变但组件总重渲染" | `useCallback` |

### useMemo：缓存计算结果

```jsx
// ❌ 每次渲染都过滤——即使 keyword 没变
function SlowList({ keyword, list }) {
  const filtered = list.filter(item => item.includes(keyword));
  return <div>{filtered.length} 条结果</div>;
}

// ✅ keyword 或 list 不变时，直接返回上一次的过滤结果
function SlowList({ keyword, list }) {
  const filtered = useMemo(() => {
    return list.filter(item => item.includes(keyword));
  }, [keyword, list]);  // 只有这俩变了才重新算
  return <div>{filtered.length} 条结果</div>;
}
```

### useCallback：稳定函数引用

```jsx
function Parent() {
  const [text, setText] = useState('');

  // ❌ 每次渲染创建新函数 → React.memo 浅比较失败 → 子组件重渲染
  const handleClick = () => console.log('点击');

  // ✅ 引用保持不变
  const handleClick = useCallback(() => console.log('点击'), []);

  return <Child onClick={handleClick} />;
}

const Child = React.memo(function Child({ onClick }) {
  return <button onClick={onClick}>点击</button>;
});
```

### React.memo：跳过子组件渲染

```jsx
const MemoComponent = React.memo(function MemoComponent(props) {
  // props 没变 → 跳过渲染，复用上次结果
  // props 变了 → 正常渲染
});
```

**React.memo 做的事情：** 浅比较新旧 props 的每个 key，如果全部相同，跳过本次渲染。

### 三者配合：完整示例

```jsx
function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  // ① useMemo：过滤结果缓存
  const filteredTodos = useMemo(() => {
    return filter === 'all' ? todos : todos.filter(t => !t.completed);
  }, [todos, filter]);

  // ② useCallback：函数引用稳定
  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }, []);

  return (
    <div>
      {filteredTodos.map(todo => (
        // ③ React.memo：todo 没变 → 跳过渲染
        <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />
      ))}
    </div>
  );
}

const TodoItem = React.memo(function TodoItem({ todo, onToggle }) {
  return (
    <div>
      <Checkbox checked={todo.completed} onChange={onToggle} />
      <span>{todo.title}</span>
    </div>
  );
});
```

**效果：** 修改一个 todo → 只有那个 TodoItem 重渲染，其他跳过。

### 什么时候不该用

| 场景 | 建议 | 原因 |
|------|------|------|
| 计算很简单（加减乘除） | ❌ 不用 | useMemo 的比较开销 > 计算本身 |
| 子组件很轻量（一个 div） | ❌ 不用 | React.memo 浅比较反而不划算 |
| 子组件没包 React.memo | ❌ 不用 | useCallback 传下去也无效 |
| 依赖总是变化 | ❌ 不用 | 缓存总是失效，白做 |
| 列表项 > 10，操作频繁 | ✅ 用 | 收益明显 |

---

## 六、实战：用 Profiler 验证优化效果

前面讲了这么多理论，现在用 **React DevTools Profiler** 来真实验证。

### 实验环境

项目中的 TodoPage，列表有 3 条数据。

### 优化前：录制火焰图

```
F12 → Profiler 标签 → 点录制 🔴
点击第一个 todo 的 checkbox
停止录制 ⏹
```

**结果：**

| 组件 | 渲染了？ | 说明 |
|------|---------|------|
| TodoPage | ✅ | state 变了，必须渲染 |
| TodoItem#1（被点的） | ✅ | 它自己的 completed 变了 |
| TodoItem#2（没点它） | ❌ **也渲染了** | **不该渲染——数据没变** |
| TodoItem#3（没点它） | ❌ **也渲染了** | **不该渲染——数据没变** |

**问题明确：** 点击一个 checkbox → `setTodos` → TodoPage 重渲染 → **所有 3 个 TodoItem 全部重渲染**，浪费了 2/3。

### 优化方案

**修改 1：TodoItem 加 React.memo**

```jsx
const TodoItem = React.memo(function TodoItem({ todo, ... }) { ... });
```

**修改 2：回调函数加 useCallback**

```jsx
const toggleTodo = useCallback(async (id) => {
  const todo = todosRef.current.find(t => t.id === id);
  setTodos(prev => prev.map(t => t.id === id ? response.data : t));
}, []); // 依赖 [] → 引用永远不变
```

**修改 3：setTodos 改用函数式更新**

```jsx
// ❌ 之前：依赖外部 todos
setTodos(todos.map(...))

// ✅ 之后：不依赖外部变量
setTodos(prev => prev.map(...))
```

### 优化后：重新录制

```
保持 Profiler 开启 → 再次录制
重复同样的操作：点击 checkbox
```

**结果：**

| 组件 | 优化前 | 优化后 |
|------|--------|--------|
| TodoItem#1（被点的） | ✅ 渲染 | ✅ 渲染 |
| TodoItem#2（没点它） | ❌ 也渲染了 | ✅ **跳过** |
| TodoItem#3（没点它） | ❌ 也渲染了 | ✅ **跳过** |

渲染次数从 3 个降到了 1 个。

### 验证方法总结

```
1. 打开 F12 → Profiler 标签 → 点录制 🔴
2. 在页面上交互（点击/打字）
3. 停止录制 → 看火焰图
4. 点击组件 → 右侧看 "Why did this render?"
   - "No change in props" → 跳过渲染 ✅
   - "Props changed: xxx" → 渲染原因
```

---

## 七、总结

### 理解链路

把整篇文章串起来：

```
setState()
  → 组件函数重头执行（Day 1）
    → hooks 按链表顺序执行（Day 2）
      → useEffect 按依赖执行或跳过（Day 3）
        → useRef 保持跨渲染引用（Day 4）
          → 生成新 JSX
            → 虚拟 DOM Diff
              → 提交到真实 DOM

性能优化（Day 5）：
  useMemo       跳过耗时计算
  useCallback   稳定函数引用
  React.memo    跳过子组件渲染
                ↓
  三者配合 → Profiler 验证（Day 6）
```

### 关于性能优化的核心认知

```
useMemo     → 缓存计算值，不要重新算
useCallback → 缓存函数，不要重新创建
React.memo  → 比较 props，不要重新渲染

三者各司其职，配合使用。
useMemo/useCallback 本身不阻止任何渲染，
它们提供稳定的值和引用，让 React.memo 能生效。
```

### 一句话回答面试官

> **"一个 setState 后，组件函数重新执行，按 hooks 链表顺序重新调用所有 hooks，生成新 JSX，经过虚拟 DOM Diff 比较，最后把差异提交到真实 DOM。子组件默认跟随父组件渲染，但可以用 React.memo + useCallback 跳过不必要的渲染，用 useMemo 跳过不必要的计算。"**

### 后续可以继续深入的方向

- Fiber 架构：React 为什么能中断渲染
- Diff 算法：key 为什么不能是 index
- React 18 自动批处理
- useDeferredValue 与并发模式
- 代码分割与 Suspense 流式加载

---

*本文所有实验均基于项目中的 TodoPage 和 PreventRerenderExample 组件完成。所有代码可在此找到：`examples/PreventRerenderExample.jsx` 和 `pages/todo/TodoPage.jsx`*

*配套学习计划：`examples/react-learning-plan/index.md`*
