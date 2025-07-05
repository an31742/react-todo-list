<!--
 * @Author: an31742 2234170284@qq.com
 * @Date: 2025-07-03 23:57:05
 * @LastEditors: an31742 2234170284@qq.com
 * @LastEditTime: 2025-07-05 18:09:13
 * @FilePath: /react-todo-list/react学习文档.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# useReducer的使用

- 是react用于提供状态管理Hook,它特别适合处理复杂场景

## 核心概念
- reducer 函数:一个纯函数，接收当前状态和一个动作action 返回新的状态(state,action)=>newSate,
- Action 一个描述发生了什么的对象 通常包含type字段
- Dispatch 函数 :用于触发状态更新的函数发送action 给reducer
  
## 基础语法

```jsx
const [state,dispatch]=useReducer(reducer, initialState)
```

## 使用步骤
- 定义render函数
  
```jsx
const reducer = (state,action) =>{
    switch (action.type){
        case 'ADD':
            return {count:state.count + 1}
       case 'SUBTRACT':
            return {count:state.count + 1}
         case 'SET':
      return { count: action.payload };
    default:
      return state;    
        
    }
}

```

## 初始化状态
```jsx
const initialState={count :0}
```

## 在组件中使用
```jsx

function Counter (){
    const [state,dispatch] =useReducer(reducer,initialState)
    return (
     <div>
        <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'ADD' })}>+</button>
      <button onClick={() => dispatch({ type: 'SUBTRACT' })}>-</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 10 })}>
        Set to 10
      </button>
     </div>
    )
}

```
