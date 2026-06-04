好的，以下是优化后的笔记，保留了你那三句核心总结，仅对其他部分进行了结构梳理和表述精炼。

---

## Day 9 React 线笔记：Fiber 节点结构

### 一、简化版 Fiber 接口定义

```ts
type WorkTag = 'FunctionComponent' | 'HostComponent' | 'ClassComponent';

interface Fiber {
  tag: WorkTag;          // 组件类型
  type: any;             // 函数组件是函数本身，HostComponent 是字符串
  stateNode: any;        // 对应的真实 DOM 或组件实例

  // 链表关系（遍历骨架）
  child: Fiber | null;   // 指向第一个子节点
  sibling: Fiber | null; // 指向下一个兄弟节点
  return: Fiber | null;  // 指向父节点
  index: number;         // 在兄弟节点中的位置索引，用于 Diff 判断顺序

  // 状态与 Props
  pendingProps: any;
  memoizedProps: any;
  memoizedState: any;    // hooks 链表挂载点
  deletions: any;        // 父节点上收集的需要删除的子节点，Commit 阶段批量卸载

  // 双缓冲
  alternate: Fiber | null; // 指向另一棵树上的对应节点

  // 副作用标记
  flags: number;         // 新版副作用标记（位运算），替代旧版 effectTag
  subtreeFlags: number;  // 子树的副作用标记合并，用于快速跳过无变更子树
  effectTag: number;     // 旧版副作用标记（Placement / Update / Deletion），学习阶段保留对照
  nextEffect: Fiber | null; // 指向下一个有副作用的 Fiber，Commit 阶段使用

  // 调度优先级
  lanes: number;         // 当前 Fiber 的调度优先级，决定更新紧急程度
  childLanes: number;    // 子节点的优先级集合，判断子树是否有工作要做
}
```

### 二、示例组件树

```
App (FunctionComponent)
├── Guard (FunctionComponent)
├── TodoPage (FunctionComponent)
├── TodoItem (FunctionComponent)
```

### 三、对应的 Fiber 链表指针关系

```
App.child = Guard

Guard.sibling = TodoPage
TodoPage.sibling = TodoItem
TodoItem.sibling = null

Guard.return = App
TodoPage.return = App
TodoItem.return = App
```

### 四、Fiber 架构三大核心优势

- **可中断**：链表结构让遍历随时可以暂停、回到父节点，不再被递归调用栈锁死。
- **双缓冲直接替换**：`current` ↔ `workInProgress` 通过 `alternate` 相连，只需切换根指针，整个页面瞬间更新。
- **时间分片**：利用浏览器空闲时间处理下一个 Fiber 节点，`lanes` 区分紧急程度，保证交互不卡顿。

---

这样你的笔记就完成了结构统一和术语修正（尤其是 `subtreeFlags` 的类型），三句精华原封不动保留，后续复习时一目了然。