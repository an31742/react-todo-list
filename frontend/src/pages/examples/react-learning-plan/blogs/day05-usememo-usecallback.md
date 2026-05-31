# Day 5：useMemo & useCallback & React.memo——性能优化三件套

> 系列：React 从"会用"到"能讲"
> 日期：2026-05-30

## 一句话总结

**useMemo 缓存计算结果，useCallback 缓存函数引用，React.memo 跳过子组件渲染。三者各司其职，配合才能真正减少不必要的渲染。**

> 很多人以为"useMemo 阻止了组件渲染"——这是错的。它们只是提供稳定值/引用，让 React.memo 能生效。

---

## 一、先搞清楚一个关键认知

### ❌ 常见误解

```
"用了 useMemo/useCallback → 组件就不重渲染了"
```

### ✅ 真相

```
useMemo → 跳过「计算过程」，不是跳过组件渲染
useCallback → 稳定「函数引用」，不是跳过组件渲染

它们只是把"值"和"函数"稳住，
让 React.memo（浅比较 props）能生效 → 子组件跳过渲染
```

**三个工具，各管各的：**

| 工具 | 缓存什么 | 解决什么问题 | 需要配合谁 |
|------|---------|-------------|-----------|
| `useMemo` | 计算结果 | "计算太慢，输入却每回都一样" | —（自己用就行） |
| `useCallback` | 函数引用 | "函数每次新建，子组件 props 总变" | `React.memo` |
| `React.memo` | 组件渲染 | "props 没变但组件总重渲染" | `useCallback` |

---

## 二、useMemo：缓存计算结果

### 问题场景

```jsx
function SlowList({ keyword, list }) {
  // 每次渲染都过滤一次——即使 keyword 没变
  const filtered = list.filter(item => {
    console.log('💥 过滤执行了！');
    return item.includes(keyword);
  });

  return <div>{filtered.length} 条结果</div>;
}
```

如果 list 有几万条，每次父组件因为别的原因重渲染时，这个过滤就白白执行一次。

### 用 useMemo 修复

```jsx
function SlowList({ keyword, list }) {
  const filtered = useMemo(() => {
    console.log('💥 过滤执行了！');
    return list.filter(item => item.includes(keyword));
  }, [keyword, list]); // ✅ 只有 keyword 或 list 变化时才重新过滤

  return <div>{filtered.length} 条结果</div>;
}
```

### 使用场景

| 场景 | 示例 | 用 useMemo？ |
|------|------|-------------|
| 过滤/排序大数据集 | 10000 条数据的搜索 | ✅ 强烈建议 |
| 复杂计算 | 多层循环、数学运算 | ✅ 建议 |
| 拼接字符串 | `fullName = firstName + lastName` | ❌ 没必要 |
| 简单算术 | `double = count * 2` | ❌ 没必要 |

**什么时候不用：**

```jsx
const fullName = firstName + ' ' + lastName; // ✅ 这点计算，useMemo 的开销反而更大

// 错误示范——过度优化
const fullName = useMemo(() => firstName + ' ' + lastName, [firstName, lastName]);
// useMemo 本身要做依赖比较，比直接拼接一行代码慢得多
```

### 实验验证

在你的 `PreventRerenderExample.jsx` 中：

```
切换到 1. useMemo tab
在输入框打字：
  ❌ 左栏：expensiveFn 执行次数 +1（每次渲染都算）
  ✅ 右栏：expensiveFn 执行次数不变（count 没变，跳过计算）

点 +/- 按钮：
  ❌ 左栏：+1
  ✅ 右栏：也 +1（count 变了，缓存失效，重新计算是对的）
```

---

## 三、useCallback：稳定函数引用

### 问题场景

```jsx
function Parent() {
  const [text, setText] = useState('');

  // ❌ 每次渲染都创建一个新函数
  const handleClick = () => {
    console.log('点击了');
  };

  return <Child onClick={handleClick} />;
}

// 虽然包了 React.memo……
const Child = React.memo(function Child({ onClick }) {
  console.log('Child 渲染');
  return <button onClick={onClick}>点击</button>;
});
```

**问题：** 每次父组件渲染（比如输入框打字），`handleClick` 都是新的函数。**即使包了 React.memo，浅比较发现 `onClick` 的引用变了 → 子组件重渲染。**

### 用 useCallback 修复

```jsx
function Parent() {
  const [text, setText] = useState('');

  // ✅ 引用保持不变（依赖 []，函数永远不会变）
  const handleClick = useCallback(() => {
    console.log('点击了');
  }, []);

  return <Child onClick={handleClick} />;
}

const Child = React.memo(function Child({ onClick }) {
  console.log('Child 渲染——只在首次渲染');
  return <button onClick={onClick}>点击</button>;
});
```

现在输入框打字时：`handleClick` 引用不变 → React.memo 发现 props 没变 → **Child 跳过渲染。**

### 什么时候用 useCallback？

```jsx
// ✅ 应该用：函数传给 React.memo 的子组件
<ExpensiveTree onClick={handleClick} />

// ❌ 没必要：函数只在本组件用
const handleSomething = () => { ... };
<button onClick={() => handleSomething()} />

// ❌ 没必要：子组件没包 React.memo
<Child onClick={handleClick} /> {/* Child 没 memo，父渲染子必渲染 */}
```

### 依赖数组与函数式更新

```jsx
const [count, setCount] = useState(0);

// ❌ 需要把 count 加入依赖
const handleClick = useCallback(() => {
  setCount(count + 1); // 读取了 count
}, [count]); // count 变了，handleClick 就重新创建

// ✅ 函数式更新——不依赖外部变量，依赖 [] 永远稳定
const handleClick = useCallback(() => {
  setCount(prev => prev + 1); // 不读取 count
}, []); // ✅ 永远不变
```

---

## 四、React.memo：跳过子组件渲染

### 它是怎么工作的

```jsx
const MemoComponent = React.memo(function MemoComponent(props) {
  // 组件代码
});
```

**React.memo 做的事情本质上就是：**

```js
// 伪代码——React.memo 的简化实现
function memo(Component) {
  let prevProps = null;

  return function MemoizedComponent(props) {
    if (shallowEqual(prevProps, props)) {
      // ✅ props 没变 → 跳过渲染，复用上次结果
      return prevRenderResult;
    }
    // props 变了 → 正常渲染
    prevProps = props;
    return Component(props);
  };
}

// 浅比较 ≈ 遍历 props 的每个 key，用 === 比较
function shallowEqual(objA, objB) {
  if (objA === objB) return true;
  // 对比每个 key 的值引用是否相同
  for (let key in objA) {
    if (objA[key] !== objB[key]) return false;
  }
  return true;
}
```

### 实验：验证浅比较在做什么

```jsx
// { value: 1 } === { value: 1 } 吗？
// ❌ 不等于！两个对象字面量在内存中是不同地址

// 但如果传的是同一个引用：
const obj = { value: 1 };
// 第一次：<Child data={obj} />
// 第二次：<Child data={obj} /> ← 同一个 obj → shallowEqual 通过
```

### React.memo 不是万能的

```jsx
// ❌ 对象字面量每次都新创建——memo 没用了
<Child style={{ color: 'red' }} />

// ✅ 提取到组件外或 useMemo
const style = { color: 'red' };
<Child style={style} />
```

---

## 五、三者配合：完整链路拆解

### 配合链路图

```
组件重渲染时：

  useMemo → 检查依赖是否变化
     ├─ 没变 → 返回缓存值（跳过计算）
     └─ 变了 → 重新计算

  useCallback → 检查依赖是否变化
     ├─ 没变 → 返回同一个函数（引用稳定）
     └─ 变了 → 创建新函数

  React.memo → 浅比较 props
     ├─ props 都没变 → 跳过渲染 ❌
     └─ 任何一个变了 → 正常渲染 ✅
```

### 一个完整的优化示例

```jsx
function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  // ① useMemo：只过滤变化时才重新计算
  const filteredTodos = useMemo(() => {
    return filter === 'all' ? todos : todos.filter(t => !t.completed);
  }, [todos, filter]);

  // ② useCallback：函数引用稳定
  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }, []); // 函数式更新 → 依赖 []

  return (
    <div>
      {filteredTodos.map(todo => (
        // ③ React.memo：todo 没变就不重渲染
        <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />
      ))}
    </div>
  );
}

// React.memo：浅比较 props
const TodoItem = React.memo(function TodoItem({ todo, onToggle }) {
  return (
    <div>
      <Checkbox checked={todo.completed} onChange={onToggle} />
      <span>{todo.title}</span>
    </div>
  );
});
```

**效果：** 修改一个 todo → 只有那个 todo 的 TodoItem 重渲染，其他跳过。

---

## 六、什么时候不该用？

| 场景 | 建议 | 原因 |
|------|------|------|
| 计算很简单（加减乘除） | ❌ 不用 | useMemo 的比较开销 > 计算本身 |
| 子组件很轻量（一个 div） | ❌ 不用 | React.memo 的浅比较反而不划算 |
| 子组件没包 React.memo | ❌ 不用 | useCallback 传下去也无效 |
| 依赖总是变化 | ❌ 不用 | 缓存总是失效，白做 |
| 列表项 > 10，操作频繁 | ✅ 用 | 收益明显 |
| 组件渲染很重（图表、列表） | ✅ 用 | 必须优化 |

### Profiler 是判断依据

**先用 React DevTools Profiler 测量，找到真正的性能瓶颈，再针对性地优化。** 不要一开始就到处加 memo/useMemo/useCallback——那是"猜"优化，不是"基于数据"的优化。

## 七、总结

### 一句话记法

```
useMemo     → 缓存计算值，不要重新算
useCallback → 缓存函数，不要重新创建
React.memo  → 比较 props，不要重新渲染
```

### 最关键的一句话

**useMemo/useCallback 本身不阻止任何渲染。** 它们只是把"值"和"函数引用"稳住，让 React.memo 的浅比较能通过，**从而**减少子组件的不必要渲染。

### 思维模型对比

```
误解者的脑内模型：
  useMemo → 组件不渲染 ✅

正确者的脑内模型：
  useMemo → 跳过计算过程，不跳过渲染
  useCallback → 稳定引用，不跳过渲染
  React.memo → 浅比较 props → 跳过渲染

  三者配合：
  useCallback → 让 props.onClick 稳定
  → React.memo 发现 props 没变
  → 跳过子组件渲染
```

---

**下一篇：** [Day 6：React DevTools Profiler 实战——用数据说话](day06-profiler.md)
