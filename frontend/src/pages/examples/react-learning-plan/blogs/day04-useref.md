# Day 4：useRef——不触发渲染的"变量保险箱"

> 系列：React 从"会用"到"能讲"
> 日期：2026-05-29

## 一句话总结

**useRef 创建一个在组件整个生命周期中都保持不变的"盒子"，修改它不会触发组件重渲染。**

---

## 一、问题：useRef 是什么？

如果你需要一个**在渲染之间保持不变**的东西，但又不想因为它变化而触发重渲染——那就是 `useRef`。

```jsx
const ref = useRef(初始值);
// ref.current → 读写这个值
```

本质上，`useRef` 就是：

```jsx
// React 内部大概是这样实现的：
function useRef(initialValue) {
  const [ref] = useState({ current: initialValue });
  return ref; // ✅ 返回同一个对象，修改 current 不触发 setState
}
```

但关键区别：**修改 `ref.current` 不会触发组件重渲染。**

## 二、实验：对比 useState 和 useRef

```jsx
function CompareDemo() {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  const handleStateClick = () => {
    setCount(count + 1);        // ✅ 页面更新（触发了重渲染）
  };

  const handleRefClick = () => {
    countRef.current += 1;       // ✅ 值变了，但页面不变
    console.log('ref:', countRef.current);
  };

  console.log('组件渲染了');

  return (
    <div>
      <p>useState: {count}</p>
      <p>useRef: {countRef.current}</p>
      {/* 注意上面这行——即使 ref.current 变了，这里也不会更新 */}
      <button onClick={handleStateClick}>useState +1</button>
      <button onClick={handleRefClick}>useRef +1</button>
    </div>
  );
}
```

点击两个按钮的对比：

| 操作 | `count`（useState） | `countRef.current`（useRef） | 组件是否重渲染 |
|------|---------------------|------------------------------|--------------|
| 点 "useState +1" | 0 → 1 ✅ 更新 | 不变 | ✅ 触发了 |
| 点 "useRef +1" | 不变 | 0 → 1 ✅ 更新了 | ❌ 没触发 |
| 点 "useState +1" | 1 → 2 | 1（保持） | ✅ 触发 |
| 点 "useRef +1" 多次 | 不变 | 1 → 2 → 3 → …… | ❌ **一直没触发** |

**useRef 的值确实变了，控制台能打印出最新值，但页面不会更新。**

## 三、useRef 的三大用途

### 用途 1：访问 DOM 元素

最常见的用法：

```jsx
function AutoFocus() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus(); // ✅ 组件挂载后自动聚焦
  }, []);

  return <input ref={inputRef} placeholder="自动聚焦" />;
}
```

**原理：** React 在渲染完成后，把真实 DOM 节点赋值给 `ref.current`。

更多 DOM 操作：

```jsx
function VideoPlayer() {
  const videoRef = useRef(null);

  const play = () => videoRef.current?.play();
  const pause = () => videoRef.current?.pause();
  const getProgress = () => videoRef.current?.currentTime;

  return (
    <div>
      <video ref={videoRef} src="demo.mp4" />
      <button onClick={play}>播放</button>
      <button onClick={pause}>暂停</button>
    </div>
  );
}
```

### 用途 2：保存可变值，不触发重渲染

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);  // 保存定时器 ID

  const start = () => {
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(timerRef.current); // ✅ 通过 ref 拿到定时器 ID
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current); // ✅ 组件卸载时清理
  }, []);

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={start}>开始</button>
      <button onClick={stop}>停止</button>
    </div>
  );
}
```

**为什么不用变量保存？**

```jsx
// ❌ 普通变量——每次渲染都重新创建，拿不到上一次的值
function Timer() {
  let timerId = null; // 每次渲染都重置为 null！

  const start = () => {
    timerId = setInterval(...);
    // 下一行能在 stop 里访问到吗？不能——下次渲染 timerId 又变回 null 了
  };
}
```

**为什么不用 useState？**

```jsx
// ❌ useState——改了会触发重渲染
const [timerId, setTimerId] = useState(null);
// 存个定时器 ID 而已，没必要让组件因为 timerId 变化而重渲染
```

### 用途 3：跨渲染保持最新值（解决闭包陷阱）

这是 useRef 最强大的用法之一：

```jsx
function LatestValueDemo() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  // ✅ 每次渲染后，把最新的 count 同步到 ref
  useEffect(() => {
    countRef.current = count;
  });

  // 3 秒后弹窗——显示的是最新的 count 还是点击时的 count？
  const handleClick = () => {
    setTimeout(() => {
      alert(`count: ${count}`);           // ❌ 闭包陷阱——点击时的值
      alert(`ref: ${countRef.current}`);   // ✅ 永远是最新值
    }, 3000);
    setCount(count + 1);
  };

  return <button onClick={handleClick}>点击，等 3 秒</button>;
}
```

**这是 useCallback 中常见的模式——用 ref 保存最新值，避免把值加入依赖数组：**

```jsx
function AutoSave({ data }) {
  const dataRef = useRef(data);

  // 每次渲染同步最新值到 ref
  useEffect(() => {
    dataRef.current = data;
  });

  // 每 30 秒自动保存——不依赖 data，避免了定时器重建
  useEffect(() => {
    const timer = setInterval(() => {
      saveToServer(dataRef.current); // ✅ 永远读取最新数据
    }, 30000);
    return () => clearInterval(timer);
  }, []); // ✅ 依赖数组为空，定时器只创建一次
}
```

## 四、useRef 常见错误

### 错误 1：修改 ref 后想看到页面更新

```jsx
function Wrong() {
  const countRef = useRef(0);

  const increment = () => {
    countRef.current += 1;
    // ❌ 页面不会更新！ref 变化不触发渲染
  };

  return <div>{countRef.current}</div>; // 永远显示 0
}
```

**修复方案：** 需要用 `useState`。

### 错误 2：在渲染期间读写 ref

```jsx
function Wrong() {
  const ref = useRef(0);

  // ❌ 不要在渲染期间修改 ref（可能导致不一致）
  ref.current = Math.random();

  // ✅ OK：ref 读取可以在渲染期间进行
  return <div>{ref.current}</div>;
}
```

官方推荐：**在 effect 或事件处理函数中修改 ref.current。**

### 错误 3：忘记 useRef 在不同渲染间保持引用

```jsx
function Counter() {
  const objRef = useRef({ count: 0 });
  // 这个对象在组件的整个生命周期中都是同一个对象！

  // ✅ 对比普通变量
  const obj = { count: 0 }; // 每次渲染都是一个新对象
}
```

## 五、useRef vs useState 选择指南

| 需求 | 用什么 | 原因 |
|------|--------|------|
| 页面显示这个值 | `useState` | 值变需要刷新 UI |
| 值变了但 UI 不用动 | `useRef` | 避免不必要渲染 |
| 需要 DOM 元素 | `useRef` | `ref` 属性绑定用 |
| 定时器 ID / 订阅句柄 | `useRef` | 不需要渲染 |
| 表单输入实时更新 | `useState` | 需要 UI 同步 |
| 保存上一次的值 | `useRef` | 跨渲染持久化 |
| 解决闭包陷阱 | `useRef` | 保持最新引用 |

**图：useState vs useRef 在渲染中的差异**

```
useState:
  修改值 → 组件重渲染 → 新 UI 展示
  重渲染 → 重新获取值（更新的）

useRef:
  修改值 → 不渲染
  重渲染（由其他 state 触发）→ ref.current 保持上一个修改后的值
```

## 六、总结

```jsx
// useRef 的三个核心特征
const ref = useRef(initialValue);

// 1. 同一个对象，渲染间共享
// 2. 修改不触发渲染
// 3. 常用于 DOM 引用、持久化数据、解决闭包陷阱
```

**对比一下：**

| | useState | useRef |
|--|---------|--------|
| 修改触发渲染？ | ✅ 是 | ❌ 否 |
| 跨渲染保持值？ | ✅ 是 | ✅ 是 |
| 什么时候用？ | 要展示到 UI 上 | 只要存着，不用展示 |

---

**下一篇：** [Day 5：useMemo & useCallback & React.memo——性能优化三件套](day05-usememo-usecallback.md)
