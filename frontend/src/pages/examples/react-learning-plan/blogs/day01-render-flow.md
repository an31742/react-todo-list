# 第一天学习笔记：React 渲染流程
核心目标：彻底搞懂“一个 setState 调用后 React 到底做了什么”。

一、React 渲染的本质
组件就是一个函数，渲染就是调用这个函数。当状态（state）更新时，React 会重新调用该组件函数，得到新的 JSX，然后与旧的虚拟 DOM 进行对比（Diff），最后只更新变化的部分到真实 DOM。

二、一个 setState 调用后的完整链路
1. 调用 setState(newValue)  
2. React 标记该组件需要更新  
3. React 重新执行该组件的函数，拿到全新的 JSX（虚拟 DOM）  
4. 新 JSX 与上一次的虚拟 DOM 进行 Diff 对比  
5. 找到差异后，React 进入 Commit 阶段，只更新变化的那部分真实 DOM
整个过程分为两个阶段：
阶段	做什么	能否中断
Render 阶段	纯 JS 计算，生成虚拟 DOM，进行 Diff	✅ 可以中断（Fiber 架构）
Commit 阶段	操作真实 DOM，将变化“渲染”到屏幕上	❌ 不可中断，保证界面一致性

三、动手实验（必须亲手做）
任务：在你的 Todo 项目中观察渲染行为
1. 在组件函数体第一行加上 console.log('🟢 App 渲染了')，为子组件（如 TodoItem）也加上类似日志。  
2. 操作页面（添加、编辑一条 Todo），观察控制台打印。  
3. 使用 React DevTools 的 ⚛️ Components 标签，勾选 “Highlight updates when components render”，观察蓝色高亮框的闪烁。
观察结论：
● 所有组件（包括没有直接关联的子组件）都可能被重新执行，因为父组件渲染会导致其所有子组件默认重新渲染。
● 组件函数重新执行（Render 阶段）不意味着一定会发生真实 DOM 更新（Commit 阶段）。
● 真实 DOM 更新只发生在状态真正发生变化的地方。

四、今日核心理解
● 渲染不是直接改 DOM，而是先执行一遍函数拿到新的 JSX，再通过 Diff 决定真正改动哪些真实 DOM。
● 每次状态更新都可能触发多个组件的重新执行，但 React 的 Diff 算法能保证最终 DOM 操作是最小化的。
● console.log 在组件函数体中打印 → 对应 Render 阶段（计算）。
useEffect 中打印 → 对应 Commit 阶段之后（DOM 已更新）。

五、个人总结（用自己的话写下来）
今天我理解了 React 渲染的本质：每次状态更新都会触发组件函数的重新执行，产生新的虚拟 DOM，然后与旧的虚拟 DOM 比较，最后只更新变化部分的真实 DOM。这个过程分为可中断的 Render 阶段和不可中断的 Commit 阶段。通过在自己的 Todo 项目中添加渲染日志，我亲眼看到了哪些组件被重复执行，哪些实际更新了 DOM，这让我对 React 的更新机制有了直观的认识。

这份笔记将帮你随时回顾 React 运行机制的基础，也是后续学习 Fiber、Diff 和性能优化的基石。