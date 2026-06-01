# 第五天学习笔记：useMemo 与 useCallback 实战

**核心目标**：真正理解 `useMemo` 和 `useCallback` 的作用——不是“让组件不渲染”，而是**缓存计算结果**和**保持函数引用稳定**，从而配合 `React.memo` 减少子组件不必要的渲染。能够用 React DevTools Profiler 验证优化效果，并懂得何时不该用它们。

---

### 一、useMemo：缓存计算结果

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

- 只有当依赖 `[a, b]` 发生变化时，才重新执行函数并返回新的值。
- 依赖不变时直接返回上一次缓存的值，**避免重复计算**。
- **不会阻止组件渲染**，只节省计算时间。

**实验**：
```jsx
const expensiveResult = useMemo(() => {
  console.log('🔴 正在执行昂贵的计算...');
  // 模拟耗时计算
  let result = 0;
  for (let i = 0; i < 1000000000; i++) { result += i; }
  return result + num;
}, [num]); // 只有 num 变化才重新计算
```
- 点击“增加 num”：触发昂贵的计算（控制台打印，页面卡顿）。
- 点击“Toggle”切换无关 state：**不会重新计算**，直接使用缓存值。

---

### 二、useCallback：缓存函数引用

```js
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

- 等价于 `useMemo(() => fn, [a, b])`，专门用来记忆函数。
- 依赖不变时返回**同一个函数引用**，避免因函数引用变化导致子组件（用 `React.memo` 包裹的）不必要的渲染。

**前提**：必须配合 `React.memo` 使用，否则父组件渲染时子组件依然会重渲染。

---

### 三、useMemo / useCallback + React.memo 的协作机制

**React.memo**：对组件的 props 进行**浅比较**，如果 props 没有变化，则跳过子组件渲染。

**为什么需要 useCallback / useMemo？**
- 父组件每次渲染，内部定义的函数和对象都会重新创建，引用地址改变。
- 如果这些新引用作为 props 传给 `React.memo` 的子组件，浅比较会判定 props 变化，导致子组件重新渲染。
- 使用 `useCallback` / `useMemo` 可以让这些引用在依赖不变时保持稳定，从而使 `React.memo` 的浅比较返回 `true`（没变化），子组件跳过重渲染。

**实验**：
```jsx
// 父组件
const handleClickNormal = () => console.log('普通回调');             // 每次都是新函数
const handleClickMemoized = useCallback(() => console.log('记忆化'), []); // 引用稳定

<Child name="普通" onClick={handleClickNormal} />     // 每次都渲染
<Child name="记忆化" onClick={handleClickMemoized} />  // 只在首次渲染（props 没变）
```
**结果**：
- “普通”子组件在父组件更新时总是重渲染。
- “记忆化”子组件因为回调引用不变，配合 `React.memo` 跳过了重渲染。

**去掉 `React.memo`**：即使有 `useCallback`，子组件每次依然渲染，说明 **`useCallback` 必须与 `React.memo` 搭配**。

---

### 四、何时不该使用 useMemo / useCallback

- **没有性能问题时**：过早优化是万恶之源，`memo`、`useCallback` 本身也有开销（依赖比较、内存占用）。
- **计算本身很快**：`useMemo` 的缓存开销可能比重新计算更大。
- **依赖频繁变化**：`useCallback` 每次都会返回新函数，反而浪费资源。
- **子组件未包裹 `React.memo`**：`useCallback` 无法阻止渲染。
- **传递原始类型 props**：原始类型的值在浅比较下已经相等，不需要额外的记忆化。

---

### 五、核心原则

- **先定位**：用 React DevTools Profiler 找出真正存在的性能瓶颈。
- **再优化**：对引用类型的 props（函数、对象）使用 `useCallback` / `useMemo`，并配合 `React.memo` 阻断子树渲染。
- **做验证**：优化后再次用 Profiler 对比渲染次数和耗时，确保优化有效。

---

### 六、个人总结

今天我明确了 `useMemo` 和 `useCallback` 的真正用途：它们不是直接阻止渲染，而是通过**保持引用稳定**，让 `React.memo` 能够正确判断 props 是否变化，从而避免子组件不必要的渲染。通过动手实验，我亲眼看到了传递普通函数时子组件总是重渲染，而使用 `useCallback` 配合 `React.memo` 后成功跳过了重渲染。同时我也记住了它们的代价和适用边界——只有在定位到真实性能问题后才应该使用，而非到处无脑包裹。这些知识让我对 React 性能优化有了实战级掌控。