## Day12 笔记优化版：React 批量更新与快照

### 一、useState 的快照特性

每次调用 `useState` 的更新函数（如 `setCount`）**并不会改变当前渲染周期内的状态值**。当前函数作用域内的 `count` 是一个**常量快照**，代表本次渲染被固定下来的值。`setCount(count + 1)` 只是告诉 React **“在下一次渲染时，将状态更新为 `count + 1`”**。

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count); // 仍然是 0，因为这是本次渲染的快照
  }

  // 只有下一次渲染时，count 才会变成 1
}
```

**关键理解**：状态的更新是异步且基于快照的，同一个事件处理函数内的多次 `setState` 使用的都是**同一个渲染帧的状态快照**。

---

### 二、批量更新（Batching）

React 会将**同一个事件处理函数内的多次状态更新合并为一次渲染**，这被称为“批量更新”。在 React 17 及以前，批量更新只存在于合成事件和生命周期中；React 18 之后，**所有更新默认都自动批处理**（包括 `setTimeout`、原生事件等）。

```javascript
function handleClick() {
  setCount(c => c + 1);
  setCount(c => c + 1);
  setCount(c => c + 1);
  // 虽然调用了三次 setCount，但只会触发一次重新渲染
}
```

**验证方式**：在组件内添加 `useEffect` 记录渲染次数，点击按钮后会发现 `effect` 只执行了一次，证明三次更新被合并为一次渲染。

```javascript
useEffect(() => {
  console.log('组件渲染了');
});
```

**另一个验证方式**：如果三次都使用快照值 `count + 1`，由于闭包问题，最终 `count` 只会变成 `1`，而不是 `3`。改用函数式更新 `c => c + 1` 才能基于上一次的最新状态计算。

---

### 三、React 18 的自动批处理

在 React 18 之前，以下情况**不会**批量更新：
- `setTimeout` / `setInterval`
- 原生事件绑定
- Promise 回调

React 18 引入 `createRoot` 后，这些场景也会自动批处理，极大减少了不必要的渲染。

```javascript
setTimeout(() => {
  setCount(c => c + 1);
  setCount(c => c + 1);
  // 只会触发一次渲染
}, 1000);
```

---

### 四、flushSync：强制同步刷新

有时候我们需要**立即看到 DOM 更新的结果**（例如读取更新后的 DOM 尺寸），这时可以用 `flushSync` 打破批量更新，让状态更新同步执行并强制提交渲染。

```javascript
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCount(c => c + 1);
  });
  // 此时 DOM 已经更新，可以立即读取新的 DOM 状态
  console.log(document.getElementById('count').textContent);
}
```

**注意**：
- `flushSync` 内的更新会立即触发重渲染，破坏性能优化，应谨慎使用。
- 在同一事件中多次使用 `flushSync` 会导致多次连续的同步渲染。
- 与 Vue 的 `nextTick` 对比：`nextTick` 是等待 DOM 更新后执行回调，而 `flushSync` 是**主动强制刷新**，两者思路不同。

---

### 五、总结

- **快照**：当前渲染周期内的 state 是固定值，不会随 `setState` 改变。
- **批量更新**：多个状态更新被合并为一次渲染，避免无用性能开销。
- **自动批处理**：React 18 扩展到所有更新场景。
- **flushSync**：特殊情况下的“逃生舱”，可以同步刷新，但会损害性能。

> 这些理解是明天学习 Vue 的 `nextTick` 和异步更新队列的基础，届时可对比两者在设计哲学上的差异。