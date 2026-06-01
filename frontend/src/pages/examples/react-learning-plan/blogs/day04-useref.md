# 第四天学习笔记：useRef —— 不触发渲染的“持久盒子”

**核心目标**：理解 `useRef` 的本质（一个在渲染间保持不变的引用），掌握它的两大典型用途：**保存可变值**（如定时器 ID、前一个状态）和**引用 DOM 元素**，并能清楚说出它和 `useState` 的根本区别。

---

### 一、useRef 是什么？

`useRef` 返回一个普通的 JavaScript 对象：
```js
const ref = useRef(initialValue);
// ref = { current: initialValue }
```

**两个核心特性**：
1. **修改 `.current` 不会触发组件重新渲染**（这是与 `useState` 最根本的区别）。
2. **`.current` 的值在整个组件生命周期中保持同一个引用**，即使组件重新渲染，`ref` 对象本身也不变。

---

### 二、主要用途

| 用途 | 说明 | 示例 |
|------|------|------|
| **保存 DOM 元素引用** | 通过 `ref` 属性绑定 JSX 元素，获取真实 DOM 节点 | `<input ref={inputRef} />` |
| **保存不需要触发渲染的可变值** | 定时器 ID、前一个状态、是否首次渲染标记等 | `timerRef.current = setInterval(...)` |
| **解决闭包陷阱** | 在 effect 或回调中获取最新 state/props，而不需要将其加入依赖数组 | 在 effect 中用 ref 保存最新值 |

---

### 三、useRef 与 useState 的核心对比

| 特性 | useState | useRef |
|------|----------|--------|
| 值变化是否触发重新渲染 | ✅ 会触发 | ❌ 不会触发 |
| 值在渲染间是否保持同一引用 | ❌ 每次渲染都是新值 | ✅ 始终是同一个 `{ current: ... }` 对象 |
| 典型用途 | 驱动 UI 变化的数据 | 非 UI 相关的可变数据、DOM 引用 |

---

### 四、动手实验

**任务一：用 ref 保存一个计数，验证不触发渲染**

```jsx
import { useState, useRef } from 'react';

function RefCounter() {
  const [renderCount, setRenderCount] = useState(0);
  const refCount = useRef(0);

  console.log('组件渲染，refCount.current =', refCount.current);

  const addRef = () => {
    refCount.current += 1;
    console.log('ref 增加，当前值：', refCount.current);
  };

  return (
    <div>
      <p>ref 值（不会自动更新显示）：{refCount.current}</p>
      <p>渲染次数：{renderCount}</p>
      <button onClick={addRef}>增加 ref 值</button>
      <button onClick={() => setRenderCount(c => c + 1)}>强制重渲染</button>
    </div>
  );
}
```

**观察结论**：
- 点击“增加 ref 值”，控制台打印显示 `refCount.current` 在增长，但页面数字**不变化**——因为修改 ref 不触发渲染。
- 点击“强制重渲染”后，页面上的 ref 值突然更新为最新数值——因为组件重新读取了 `ref.current`，但渲染是由 `setRenderCount` 触发的，不是 ref 变化本身。

**任务二：用 ref 获取 DOM 并自动聚焦**

```jsx
import { useRef, useEffect } from 'react';

function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="页面加载后自动聚焦" />;
}
```

**结论**：通过 `ref` 属性绑定后，`inputRef.current` 就是真实的 DOM 元素，可以直接调用原生方法（如 `focus()`）。

---

### 五、个人总结

今天我理解了 `useRef` 的核心价值：它是一个**不参与渲染流程的持久化容器**。与 `useState` 不同，修改 `ref.current` 不会引发组件重绘，这使它非常适合保存定时器 ID、DOM 节点、前一个状态等不需要驱动 UI 变化的可变数据。通过亲手实现的“不更新显示的计数器”和“自动聚焦输入框”，我直观地感受到了 `useRef` 与渲染的完全解耦。这两个实验也让我记住：**ref 的值变化不会触发渲染，但在渲染发生时总会读到最新的 current 值**。以后凡是需要“记住某个值但不触发更新”的场景，我都会想到用 `useRef`。