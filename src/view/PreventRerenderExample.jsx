// import { Component } from "react";
// import PreventRerenderClass from "./PreventRerenderClass.jsx";
// // 不适用hooks
// //设置一个最大和最小值，然后生成一个随机数
// function randomInteger(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
// //设置水果的数组
// const fruits = ["banana", "orange", "apple", "kiwi", "mango"];

// //使用class来完成react的组件开发
// class PreventRerenderExample extends Component {
//   state = {
//     fruit: null,
//     counter: 0,
//   };

//   pickFruit = () => {
//     // 生成一个随机数
//     const fruitIdx = randomInteger(0, fruits.length - 1);
//     // 设置水果
//     const nextFruit = fruits[fruitIdx];
//     // 更新state
//     this.setState({
//       fruit: nextFruit,
//     });
//   };

//   componentDidMount() {
//     this.pickFruit();
//   }

//   render() {
//     return (
//       <div>
//         {/* 展示水果 */}
//         <h3>
//           Current fruit: {this.state.fruit} | counter: {this.state.counter}
//         </h3>
//       {/*随机选择一个水果*/}
//         <button onClick={this.pickFruit}>挑一个水果</button>
//         <button
//           onClick={() =>
//             this.setState(({ counter }) => ({
//               counter: counter + 1,
//             }))
//           }
//         >
//           Increment
//         </button>
//         <button
//           onClick={() =>
//             this.setState(({ counter }) => ({ counter: counter - 1 }))
//           }
//         >
//           Decrement
//         </button>
//         <div className="section">
//           {/* 展示水果父组件传过来的参数是水果 */}
//           <PreventRerenderClass fruit={this.state.fruit} />
//         </div>
//       </div>
//     );
//   }
// }

// export default PreventRerenderExample;



// 使用hooks来组织函数组件重新渲染
// 引入useState 和引入 useEffect
import { useState, useEffect } from "react";
// 引入子组件
import PreventRerenderHooks from "./PreventRerenderHooks.jsx";

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const fruits = ["banana", "orange", "apple", "kiwi", "mango"];


// 组件直接是一个方法导出这个方法
const PreventRerenderExample = () => {
  const [fruit, setFruit] = useState(null);
  const [counter, setCounter] = useState(0);

  const pickFruit = () => {
    const fruitIdx = randomInteger(0, fruits.length - 1);
    const nextFruit = fruits[fruitIdx];
    setFruit(nextFruit);
  };

  useEffect(() => {
    pickFruit();
  }, []);

  return (
    <div>
      <h3>
        Current fruit: {fruit} | counter: {counter}
      </h3>

      <button onClick={pickFruit}>挑一个水果</button>
      <button onClick={() => setCounter((counter) => counter + 1)}>
        Increment
      </button>
      <button onClick={() => setCounter((counter) => counter - 1)}>
        Decrement
      </button>
      <div className="section">
        <PreventRerenderHooks fruit={fruit} />
      </div>
    </div>
  );
};

export default PreventRerenderExample;

