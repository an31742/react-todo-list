# Day 2：Hooks 链表——为什么 hooks 不能写在 if 里

> 系列：React 从"会用"到"能讲"
> 日期：2026-05-27

## 一句话总结

**React 用链表来存储 hooks，每个 hooks 按调用顺序排队。写在 if 里会破坏顺序，导致 React 拿错数据。**

---

## 一、问题：面试常考题，但你真的理解了吗？

几乎所有 React 面试题都有一道：

> "为什么 hooks 不能写在条件语句（if/for）里？"

标准答案背得出来："因为 React 依赖调用顺序来匹配对应的 state。"

但"依赖调用顺序"是什么意思？匹配又是什么意思？今天通过实验来搞懂。

## 二、实验：故意写错，观察报错

```jsx
function BuggyComponent() {
  const [count, setCount] = useState(0);

  if (count > 0) {
    const [show, setShow] = useState(false); // ❌ 条件中使用 hooks！
  }

  const [text, setText] = useState('hello');

  return <div>{count}</div>;
}
```

第一次渲染（`count = 0`，if 条件不成立）：

```
hooks 调用顺序：useState(0) → useState('hello')
React 存储：    [第1个state] → [第2个state]
```

第二次渲染（用户点了按钮，`count = 1`，if 条件成立）：

```
hooks 调用顺序：useState(0) → useState(false) → useState('hello')
React 存储：    [第1个state] → [第2个state] → ？？？
```

**问题来了：** 第二次渲染时，React 以为第 2 个 useState 对应的是 `show`，但实际上它对应的是第一次渲染时的 `text`。数据错乱了。React 检测到 hooks 数量不一致，直接报错。

```
Uncaught Invariant Violation:
Rendered fewer hooks than expected.
This is likely caused by an accidental early return statement.
```

## 三、理解：Hooks 链表结构

React 内部不是用"变量名"来区分不同 hooks 的，而是用**顺序**。

### 组件里写的：

```jsx
function Component() {
  const [a] = useState(1);    // hook #1
  const [b] = useState(2);    // hook #2
  useEffect(() => {}, []);    // hook #3
  const [c] = useState(3);    // hook #4
  return <div />;
}
```

### React 内部存的（链表结构）：

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ hook #1  │ →  │ hook #2  │ →  │ hook #3  │ →  │ hook #4  │
│          │    │          │    │          │    │          │
│ state: 1 │    │ state: 2 │    │ effect   │    │ state: 3 │
│ next: ——→│    │ next: ——→│    │ next: ——→│    │ next:null│
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

**每次组件渲染时，React 只是从头到尾遍历这个链表，依次取出对应的数据。**

```
渲染时：
第1次调用 useState → 取链表第1个节点 → 拿到 state = 1
第2次调用 useState → 取链表第2个节点 → 拿到 state = 2
第3次调用 useEffect → 取链表第3个节点 → 拿到 effect 对象
第4次调用 useState → 取链表第4个节点 → 拿到 state = 3
```

**这和"变量名"完全无关。** 无论你的 useState 叫什么变量名，React 只数"第几次调用"。

## 四、为什么条件语句会破坏顺序？

```jsx
function Component({ flag }) {
  const [a] = useState(1);

  // 假设某次渲染 flag 从 false 变成 true
  if (flag) {
    const [b] = useState(2);
  }

  const [c] = useState(3);
}
```

### 第一次渲染（flag = false）：

```
调用顺序：useState(1) → useState(3)
链表：    [a] → [c]
```

### 第二次渲染（flag = true）：

```
调用顺序：useState(1) → useState(2) → useState(3)
链表：    [a] → [b] → [c]
```

**React 发现："第二次渲染时，你调了 3 次 hooks，但链表只有 2 个节点" → 报错**

反过来也一样——如果第一次渲染条件成立（调了 3 次 hooks），第二次条件不成立（只调了 2 次），React 同样报错。

## 五、画一张对比图

```
渲染次数1（if 不成立）：
  useState(1) ──→ useState(3)
       │               │
       ▼               ▼
    链表节点1         链表节点2
    (a = 1)          (c = 3)

渲染次数2（if 成立）：
  useState(1) ──→ useState(2) ──→ useState(3)
       │               │               │
       ▼               ▼               ▼
    链表节点1         ???              ???
    (a = 1)        报错了！         未匹配到节点
```

## 六、实际开发中的真实案例

### 错误写法：提前 return

```jsx
function UserProfile({ user }) {
  const [name, setName] = useState('');

  // ❌ 提前 return 会导致后面的 hooks 不执行
  if (!user) return <Loading />;

  useEffect(() => {
    setName(user.name);
  }, [user]);

  return <div>{name}</div>;
}
```

### 正确写法：把 return 放在 hooks 之后

```jsx
function UserProfile({ user }) {
  const [name, setName] = useState('');

  // ✅ hooks 必须全部先声明
  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  // ✅ return 放在 hooks 之后
  if (!user) return <Loading />;

  return <div>{name}</div>;
}
```

### 正确写法：条件逻辑写在 hooks 调用之后

```jsx
// ❌ 错误
if (condition) {
  const [value, setValue] = useState(0);
}

// ✅ 正确——所有 hooks 都在顶层调用
const [value, setValue] = useState(0);
// 条件逻辑写在后面
if (!condition) {
  // 不使用 value
}
```

## 七、总结

| 问题 | 答案 |
|------|------|
| hooks 靠什么匹配数据？ | **调用顺序**，不是变量名 |
| React 内部怎么存 hooks？ | **链表**，每个节点指向下一个 |
| 为什么不能写 if 里？ | 条件变化 → 调用顺序变化 → 链表匹配不上 |
| 怎么避免？ | **所有 hooks 写在函数最顶层，无条件执行** |

**理解了这个，你就真正理解了 hooks 的"顺序机制"，不再只是背答案。**

---

**下一篇：** [Day 3：useEffect 死循环与 cleanup](day03-useeffect.md)
