// import React, { useState } from 'react';

// function BrokenHook() {
//   const [name, setName] = useState('');
//   const [count, setCount] = useState(0);

//   // 故意让第二次 Hook 有条件
//   // if (count > 2) {
//     const [extra, setExtra] = useState(100);
//   // }


//   return (
//     <div>
//       <p>Count: {count}</p>
//       <button onClick={() => setCount(c => c + 1)}>+1</button>
//       <input value={name} onChange={e => setName(e.target.value)} />
//     </div>
//   );
// }

// import { useState, useEffect } from 'react';

// function InfiniteLoop () {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     // 副作用中直接修改 count，而 count 又在依赖数组里 不能在副作用修改又监听数据变化可以修改也可以监听但是不能修改又监听是监听变化然后修改 修改了又变化所以会陷入死循环
//   //   setCount(count + 1);
//     const timer = setInterval(() => {
//       setCount(prev => prev + 1);
//     }, 1000);
//   //  //为什么return 计时器就没问题
//     return () => clearInterval(timer);
//     // console.log('🟡 effect 执行了');
//   // 也就是说只要return 出来了就睡clean清除死循环  return不能清除死循环return 是做什么的呢
//   // return () => {
//   //   console.log('🔴 cleanup 执行了');
//   // };
//   }, []); // 每次 count 变化都会执行

//   return <p>Count: {count}</p>;
// }

import { useState, useRef,useEffect } from 'react';


function RefCounter () {
  const [renderCount, setRenderCount] = useState(0)
  const [inputValue, setInputValue]=useState(null)
  const refCount = useRef(0)
  const inputRef = useRef(null)
  console.log('🔵 组件渲染了，refCount.current =', refCount.current);

  const addRef = () => {
    refCount.current += 1
    console.log('🟢 ref 增加，当前值：', refCount.current);
    // 注意：页面不会显示 refCount.current 的变化，因为 React 默认不更新页面
  }


  useEffect(() => {
    console.log('🟡 effect 执行了');
    inputRef.current?.focus();
  }, [])
  const changeInput = (e) => {
    setInputValue(e.target.value)

    inputRef.current=inputValue
    // inputRef.current.focus()
  }

  console.log('当前 search:', inputValue, '上一次 search:', inputRef.current);
  return (
    <div>
      <p>ref 值（不会显示更新）：{refCount.current}</p>
      <p>渲染次数：{renderCount}</p>
      <button onClick={addRef}>增加 ref 值</button>
      {/* ref 只保存只不会渲染dom 会像变量一样保存值 */}
      <button onClick={() => setRenderCount(c=>c + 1)}>强制重渲染</button>
      <input  ref={inputRef} onChange={changeInput}/>
      {/* ref会操作dom 拿到dom里面的方法 */}
      <button >聚焦输入框</button>
    </div>
  )
}


//也就是说UseRef可以拿到上一次的值  也可拿到当前dom的值  useRef是可以获取历史的记录的



export default RefCounter;
