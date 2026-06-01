# 第七天学习笔记：React 核心原理复盘与一周总结

**核心目标**：把第一周学到的 React 核心概念彻底串联起来，形成自己的知识体系。产出一篇完整的技术文章，作为面试讲解的底气。

---

### 一、一周知识地图回顾

| 天数 | 主题 | 核心收获 |
|------|------|----------|
| 1 | React 渲染流程 | setState → 函数重执行 → 虚拟DOM → Diff → 真实DOM更新；区分 Render 和 Commit 阶段 |
| 2 | Hooks 链表模型 | Hooks 以单向链表存储，按调用顺序读取，不能放在条件/循环中 |
| 3 | useEffect 死循环与 cleanup | 死循环成因：effect 修改依赖数组中的状态；修复：函数式更新 + 清理依赖；cleanup 在下次 effect 前或卸载时执行 |
| 4 | useRef | 返回 `{ current }` 对象，修改不触发渲染，用于保存 DOM 引用、定时器 ID、前一个状态 |
| 5 | useMemo / useCallback | 缓存计算值或函数引用，配合 React.memo 避免子组件无意义渲染 |
| 6 | Profiler 性能审计 | 用 Profiler 定位不必要的渲染，组合 memo、useCallback、useMemo 优化，并量化结果 |

---

### 二、React 运行时机制核心链路（用自己的话复述）

1. **状态更新**：当调用 `setState` 时，React 标记该组件需要更新。
2. **Render 阶段（可中断）**：重新执行组件函数，生成新 JSX，并与上一次的虚拟 DOM 进行 Diff。整个过程在 Fiber 树上深度优先遍历，每个 Fiber 节点处理后可暂停（时间切片）。
3. **Commit 阶段（不可中断）**：将 Diff 结果一次性更新到真实 DOM，保证界面一致性。
4. **Hooks 系统**：每个 Hook 按顺序存储在 Fiber 节点的链表中，通过调用顺序识别身份，因此不可条件调用。
5. **副作用管理**：useEffect 在 DOM 更新后异步执行，通过依赖数组控制执行时机；cleanup 用于清理定时器、订阅等，避免内存泄漏。
6. **引用稳定与性能优化**：通过 useRef 保存不参与渲染的可变值；通过 useMemo/useCallback 保持引用不变，配合 React.memo 阻断子树渲染。

---

### 三、面试自查清单（能流利回答）

- React 为什么快？（虚拟 DOM + Diff + 批量更新 + Fiber 可中断渲染）
- Hooks 为什么不能写在 if 里？（链表存储，调用顺序必须一致）
- useEffect 为什么会死循环？如何解决？（副作用修改自身依赖；解法：函数式更新或合理设计依赖数组）
- useRef 和 useState 的根本区别？（是否触发渲染）
- useMemo、useCallback 解决了什么问题？何时无效？（稳定引用以配合 React.memo；无 memo 包裹或依赖频繁变化则失效）
- 如何用 Profiler 做一次完整性能优化？（录制 → 定位频繁渲染组件 → 稳定引用 + memo → 再次录制验证）

---

### 四、总结文章撰写提纲

**标题**：《React 运行时机制深度解析——从渲染到性能优化》

1. **React 如何更新页面**
   - 一个 setState 的旅程（流程图）
   - Render vs Commit 阶段（附自定义日志截图）
2. **Hooks 的本质**
   - 链表存储模型（配图：Fiber 与 Hook 节点关系）
   - useEffect 死循环案例与解决方案
   - useRef 的两个用途（DOM / 持久化值）
3. **性能优化的正确姿势**
   - useMemo/useCallback 不是魔法
   - React.memo 协作原理
   - Profiler 优化前后对比数据
4. **学习心得与总结**

---

### 五、个人一周学习总结

这一周我最大的改变是：**从“会写 React”过渡到“能讲清楚 React 在背后做了什么”**。我亲手打印日志、制造死循环、用 Profiler 揪出冗余渲染，并最终用 memo + useCallback 优化了自己的 Todo 项目。

最有价值的收获：
- 渲染分为 Render（计算）和 Commit（操作DOM），两者分离是可中断渲染的基础。
- Hooks 的“顺序依赖”是理解一切奇怪 bug 的钥匙。
- 性能优化要基于数据（Profiler），而不是盲目地添加记忆化。
- 写出自己的技术文章，比看十篇教程都管用。

---
