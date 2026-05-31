# Day 3：useEffect 死循环与 cleanup——最常见的 bug 和最优雅的清理

> 系列：React 从"会用"到"能讲"
> 日期：2026-05-28

## 一句话总结

**useEffect 的死循环通常是因为依赖数组没写"所有被引用的变量"。cleanup 函数是 React 在组件卸载或 effect 重新执行前给你的"清理窗口"。**

---

## 一、问题：为什么我的 useEffect 停不下来？

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  setCount(count + 1); // ❌ effect 里改了 state
}, []);                //  依赖数组是空的
```

**理论上：** `[]` 表示只在挂载时执行一次。

**实际上：** 确实只执行一次。但如果把 `count` 放进依赖数组……

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  setCount(count + 1); // ❌ 修改 → 重新渲染 → effect 重新执行 → 再次修改……
}, [count]);            //  依赖了 count
```

**死循环链路：**

```
组件挂载
  → useEffect 执行
    → setCount(1)
      → 组件重渲染（count = 1）
        → 依赖 [count] 变化了
          → useEffect 重新执行
            → setCount(2)
              → 组件重渲染（count = 2）
                → 依赖 [count] 变化了
                  → useEffect 重新执行
                    → …… 无限循环
```

每次 setCount 都让组件重渲染，重渲染又触发 useEffect，useEffect 又 setCount——**死循环达成。**

## 二、实验：故意触发死循环，然后修复

### 死循环版本

```jsx
function DeadLoop() {
  const [count, setCount] = useState(0);

  // ❌ 错误：缺少依赖
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('定时器执行了');
      setCount(count + 1);
    }, 1000);
  }, []); // 依赖数组是空的

  return <div>{count}</div>;
}
```

**问题：** `count` 被闭包捕获为 0，`setCount(0 + 1)` 永远是 1。count 显示为 1 后不再变化，但定时器仍在运行——**内存泄漏。**

### 修复 1：函数式更新（解决闭包问题）

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1); // ✅ prev 永远是最新值
  }, 1000);
  return () => clearInterval(timer); // ✅ 清理定时器
}, []); // [] 没问题了，因为不依赖 count
```

### 修复 2：写上正确的依赖（但要注意死循环）

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(timer);
}, [count]); // ✅ 依赖 count
```

⚠️ 但这里 count 每秒都变 → effect 每秒都重新执行 → 定时器每秒销毁重建。**能工作，但不是最优。**

**推荐方案 1：** 函数式更新 + 空依赖数组。既没有死循环，也没有计时器重建。

## 三、关键概念：闭包陷阱

什么是闭包陷阱？看这个：

```jsx
function ClosureTrap() {
  const [count, setCount] = useState(0);

  // 假设 3 秒后用户点了按钮
  const handleClick = () => {
    setTimeout(() => {
      alert(count); // ❌ 永远显示点击那一刻的 count，不是最新的
    }, 3000);
    setCount(count + 1);
  };

  return <button onClick={handleClick}>点击</button>;
}
```

**原因：** 点击时 `handleClick` 被创建，闭包捕获了当时的 `count`。3 秒后执行 `alert(count)`，读取的还是捕获时的值。

**发生在 useEffect 中的经典场景：**

```jsx
useEffect(() => {
  const interval = setInterval(() => {
    console.log(count); // 永远打印初始值（闭包捕获了初始的 count）
  }, 1000);
  return () => clearInterval(interval);
}, []); // 依赖为空，effect 不会重新执行，闭包中的 count 永远是初始值
```

### 解决闭包陷阱的方法

| 方案 | 适用场景 |
|------|---------|
| 函数式更新 `setCount(prev => prev + 1)` | 只是更新 state |
| 把值放进依赖数组 | 需要在 effect 中读取最新值 |
| 使用 `useRef` 保存最新值 | 不想重新执行 effect，但想读最新值 |

## 四、cleanup：为什么需要它？

### 没有 cleanup 的后果

```jsx
function ChatRoom() {
  useEffect(() => {
    chat.connect(); // ❌ 每次重渲染都连接一次，从来不关
  });
  return <div />;
}
```

组件的生命周期：

```
挂载    → connect()    ✅ 正常
更新    → connect()    ❌ 上一次连接没关！多了一个连接
更新    → connect()    ❌ 又连了一个！三个连接在跑
卸载    →              ❌ 连接还在跑！内存泄漏
```

### 加上 cleanup

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const conn = chat.connect(roomId);

    // ✅ cleanup：在下一次 effect 执行前或组件卸载时执行
    return () => {
      conn.disconnect(); // 关掉连接
    };
  }, [roomId]);
}
```

组件的生命周期：

```
挂载（roomId = "a"） → connect("a")
                               ↓
roomId 变成 "b"       → cleanup: disconnect("a")
                     → connect("b")
                               ↓
roomId 变成 "c"       → cleanup: disconnect("b")
                     → connect("c")
                               ↓
组件卸载              → cleanup: disconnect("c")    ✅ 干干净净
```

## 五、cleanup 的执行时机实验

```jsx
function CleanupDemo() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`✅ Effect 执行: count = ${count}`);

    return () => {
      console.log(`🧹 Cleanup 执行: count = ${count}`);
    };
  }, [count]);

  return <button onClick={() => setCount(c => c + 1)}>+1</button>;
}
```

点击按钮（count: 0 → 1）：

```
🧹 Cleanup 执行: count = 0    ← 清理旧值（闭包捕获了旧的 count）
✅ Effect 执行: count = 1      ← 新的 effect 跑起来
```

**关键发现：** cleanup 执行时，闭包捕获的是**上一次**的值。

## 六、实际开发中的常见场景

### 场景 1：事件监听

```jsx
useEffect(() => {
  const handleScroll = () => console.log(window.scrollY);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll); // ✅ 必须移除
}, []);
```

### 场景 2：API 请求竞态

```jsx
useEffect(() => {
  let cancelled = false;

  fetch(`/api/user/${id}`).then(data => {
    if (!cancelled) {        // ✅ 组件还没卸载才更新
      setUser(data);
    }
  });

  return () => {
    cancelled = true;        // ✅ 组件卸载了或 id 变了，忽略旧请求的结果
  };
}, [id]);
```

**为什么需要这个？** 用户快速切换 ID，请求 A 慢、请求 B 快。B 先回来显示了正确数据，A 后回来把数据覆盖成旧的。`cancelled` 标记解决了这个问题。

### 场景 3：计时器

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    setTime(Date.now());
  }, 1000);

  return () => clearInterval(timer); // ✅ 组件卸载时停止计时
}, []);
```

## 七、总结

### 死循环的成因

```
effect 里改了 state
  → 组件重渲染
    → 重渲染导致 effect 依赖变化
      → effect 重新执行
        → 又改了 state → 回到第一步
```

### cleanup 的用途

| 场景 | cleanup 做什么 |
|------|--------------|
| 定时器 | `clearInterval` |
| 事件监听 | `removeEventListener` |
| API 请求 | 设置 cancelled 标记 |
| 订阅 | `unsubscribe()` |
| 动画 | 取消动画帧 |

### 判断链条

```
当你在 useEffect 里写了一个「持续运行」的东西：
  定时器？事件监听？订阅？轮询？
  → 必须返回 cleanup 来停止它

当你的 effect 会让组件重渲染：
  setState？dispatch？
  → 检查依赖数组，确保不形成闭环
```

---

**下一篇：** [Day 4：useRef——不触发渲染的"变量保险箱"](day04-useref.md)
