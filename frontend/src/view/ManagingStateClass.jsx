// import { Component } from "react";
// // 没有引入为什么可以使用setState
// class ManagingStateClass extends Component {
//   state = {
//     counter: 0,
//     posts: [],
//     width: window.innerWidth,
//     height: window.innerHeight,
//   };
//   // 使用componentDidMount和componentDidUpdate来处理状态管理
//   // 存放到本地储存之中
//   componentDidUpdate(prevProps, prevState) {
//     localStorage.setItem("counter", this.state.counter);
//   }
//   //的调用异步接口获数据
//   componentDidMount() {
//     this.fetchPosts();
//     window.addEventListener("resize", this.updateWindowSize, {
//       passive: true,
//     });
//   }

//   fetchPosts = async () => {
//     const response = await fetch("https://jsonplaceholder.typicode.com/posts");
//     const data = await response.json();
//     this.setState({
//       posts: data.slice(0, 10),
//     });
//   };
//   increment = () => {
//     this.setState((prevState) => {
//       return {
//         counter: prevState.counter + 1,
//       };
//     });
//   };

//   decrement = () => {
//     this.setState((prevState) => {
//       return {
//         counter: prevState.counter - 1,
//       };
//     });
//   };

//   componentWillUnmount() {
//     window.removeEventListener("resize", this.updateWindowSize, {
//       passive: true,
//     });
//   }
//   // 监听窗口大小变化
//   updateWindowSize = () => {
//     this.setState({
//       width: window.innerWidth,
//       height: window.innerHeight,
//     });
//   };

//   render() {
//     return (
//       <div>
//         <div>Count: {this.state.counter}</div>
//         <div>
//           <button onClick={this.increment}>Increment</button>
//           <button onClick={this.decrement}>Decrement</button>
//         </div>
//         <div>
//           {this.state.posts.map((post) => {
//             return <div key={post.id}>{post.title}</div>;
//           })}
//         </div>
//         <div>
//           Window: {this.state.width} x {this.state.height}
//         </div>
//       </div>
//     );
//   }
// }

// export default ManagingStateClass;

// 使用hooks更加简单方便
// 使用hooks的react状态管理
import { useState, useEffect } from "react";
const ManagingStateClass = () => {
  const [counter, setCounter] = useState(0);
  const [posts, setPosts] = useState([]);
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);
  const increment = () => setCounter((counter) => counter + 1);
  const decrement = () => setCounter((counter) => counter - 1);
  const fetchPosts = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    setPosts(data.slice(0, 10));
  };
  useEffect(() => {
    localStorage.setItem("counter", counter);
    const updateWindowSize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    fetchPosts();

    window.addEventListener("resize", updateWindowSize, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize",updateWindowSize, {
        passive: true,
      });
    };
    // 这里需要使用[]来包裹依赖项，否则会无限循环调用useEffect
  }, [counter]);
  return (
    <div>
      <div>Count : {counter}</div>
      <div>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>decrement</button>
      </div>
      <div>
        {posts.map((post) => {
          return <div key={post.id}>{post.title}</div>;
        })}
      </div>
      <div>
        Window: {width} x {height}
      </div>
    </div>
  );
};

export default ManagingStateClass;
