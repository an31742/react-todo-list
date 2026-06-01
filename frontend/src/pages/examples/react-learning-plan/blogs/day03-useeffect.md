# 第三天学习笔记：useEffect 死循环与 Cleanup 执行时机

核心目标：亲手制造一个死循环，再亲手修复它；彻底理解 useEffect 的清理函数（cleanup）何时执行、为什么重要。

一、useEffect 的执行时机与依赖数组
1. 执行时机
useEffect 的回调在组件渲染并提交到 DOM 之后异步执行，不会阻塞浏览器绘制。
2. 依赖数组的作用  
  ○ useEffect(fn) —— 每次渲染后都执行（最危险）。  
  ○ useEffect(fn, []) —— 只在组件挂载后执行一次。  
  ○ useEffect(fn, [a, b]) —— 仅在 a 或 b 变化时重新执行。

二、为什么会产生死循环？
原因：副作用内部修改了某个 state，而这个 state 恰好出现在依赖数组中 → 触发重渲染 → 再次执行副作用 → 再次修改 state → 无限循环。
示例代码（死循环）：
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);       // 修改了依赖数组中的 count
}, [count]);                 // 每次 count 变化都会执行 effect
流程：
1. 首次渲染，执行 effect → setCount(count+1) → count 从 0 变成 1  
2. count 变化 → 触发重渲染，因 [count] 中有 count，effect 再次执行  
3. 再次 setCount(count+1) → count 又变 → 无限循环
报错信息：Maximum update depth exceeded

三、如何解决死循环？
方法一：使用函数式更新 + 空依赖数组  
useEffect(() => {
  setCount(prev => prev + 1);  // 函数式更新，不依赖外部 count
}, []);                        // 空依赖，只执行一次
方法二：从依赖数组中移除该 state，同时保证副作用内部不直接依赖它（例如使用 ref 保存最新值，或使用函数式更新）。
关键原理：
函数式更新 prev => prev + 1 中的 prev 是由 React 传入的最新状态值，不依赖于闭包，因此不需要将 count 加入依赖数组，打破了“修改 → 触发自身”的循环。

四、Cleanup 函数的执行时机
就是return 
useEffect 的回调可以返回一个清理函数（cleanup），React 会在两个时机调用它：
1. 下一次 effect 执行之前 —— 先清理上一次的副作用。
2. 组件卸载时 —— 防止内存泄漏。
示例代码：
useEffect(() => {
  console.log('🟡 effect 执行了');
  return () => {
    console.log('🔴 cleanup 执行了');
  };
}, [someDependency]);
观察结果：
● 依赖变化时：先打印 🔴 cleanup 执行了（上一次的清理），再打印 🟡 effect 执行了（新的副作用）。  
● 组件卸载时：只打印 🔴 cleanup 执行了。

五、对比：useEffect vs Vue watch
	useEffect	Vue watch
用途	监听依赖变化，执行副作用	监听数据变化，执行回调
执行时机	DOM 更新并绘制之后（不阻塞渲染）	DOM 更新后、绘制之前（同步执行）
清理能力	cleanup 返回函数	onCleanup（Vue3）
一句话记忆：  
useEffect 是“画完了再干杂活，不卡界面”；Vue watch 是“数据变了立刻干，干完再画”。

六、个人总结
今天我亲手制造了一个 useEffect 死循环，并学会了两种修复方法：使用函数式更新避免直接依赖 state，以及将依赖数组置空。**我还观察到 cleanup(return) 函数在下一次 effect 前和组件卸载时执行，验证了 React 的“先清理再执行”机制。**