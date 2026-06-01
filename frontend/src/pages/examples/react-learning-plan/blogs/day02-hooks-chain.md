# 第二天学习笔记：Hooks 链表存储模型与调用规则
核心目标：彻底搞懂“为什么 Hooks 不能写在条件语句或循环里”，能画出链表与组件的对应关系。

一、Hooks 在 React 内部是如何存储的？
每个组件的 Fiber 节点上挂着一个单向链表，这个链表存储着该组件中所有 Hooks 的状态。
● 每个 Hook（useState、useEffect、useRef 等）对应链表中的一个节点。
● 节点按照组件中 Hooks 的书写顺序依次连接：Hook1 → Hook2 → Hook3 → …
● 链表存储在 Fiber 节点的 memoizedState 字段上。
React 识别 Hook 的唯一依据就是调用顺序，与名称无关。

二、Hooks 是如何工作的？
第一次渲染（组件挂载）：
● React 按照源码中的书写顺序，依次创建 Hooks 链表节点，并将初始值存入节点。
后续渲染（组件更新）：
● React 会重新按相同顺序遍历链表，读取对应的状态或执行副作用。
● 如果某次渲染调用 Hooks 的次数或顺序与上次不同，链表就会错位，状态完全乱套。

三、为什么不能写在条件语句、循环或 return 之后？
如果某次渲染跳过了某个 Hook 调用，链表顺序就断了。
示例：错误代码
if (count > 2) {
  const [extra, setExtra] = useState(100);
}
问题分析：
渲染次数	条件	调用的 Hooks	链表结构
第一次	count=0，不满足	useState(count) → useState(name)	Hook0 (count) → Hook1 (name)
第二次	count=3，满足	useState(count) → useState(extra) → useState(name)	Hook0 (count) → Hook1 (extra) → Hook2 (name)
此时 React 读到 Hook1 时期望它是 name 的状态，但实际拿到的是 extra 的状态，一切全乱套，直接报错。
报错信息：
React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.
修复方法：将所有 Hooks 调用移到组件顶层，无条件调用。

四、动手实验总结
1. 故意在 if 中调用 useState，触发报错，亲眼看到顺序错乱导致的状态混乱。
2. 将条件调用移到顶层后，错误消失，恢复正常运行。
3. 画出链表对比图，直观理解 Hooks 的存储和读取机制。
核心结论：
Hooks 的“身份”完全由调用顺序决定，必须保证每次渲染调用次数相同、顺序一致，因此必须在组件顶层无条件调用。

五、个人总结
今天我亲自动手制造了 Hooks 的条件调用错误，真正理解了 React 内部用单向链表存储 Hooks 状态的原理。Hooks 不能写在 if 中的原因，**是为了保证链表顺序的稳定，避免状态错乱**。这种底层原理的了解，