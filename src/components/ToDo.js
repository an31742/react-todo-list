import ToDoInput from "./components/ToDoInput";
import ToDoList from "./components/ToDoList";
import { useState, useEffect } from "react";

function App() {
  const [list, setList] = useState([
    {
      id: "0",
      text: "李白",
    },
    {
      id: "1",
      text: "王昌龄",
    },
  ]);
  const [title, setTitle] = useState("todo 待办事项");
  useEffect(() => {
    document.title = "ToDoList";
  });
  // 当点击事件的时候将值放到了list里面通过setList不断更新
  function addToDo(t) {
    console.log("addToDo", t);
    //  子组件调用父组件里面的方法,将值传递给父组件
    const newToDo = { id: list.length + 1, text: t };
    setList([...list, newToDo]);
    // setList([...list, { id: list.length + 1, text: t }]);
  }

  return (
    <div>
      <h2
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {title}
      </h2>
      <ToDoInput addToDo={addToDo} />
      {list.length > 0 && <ToDoList foo="hello todolist" list={list} />}
    </div>
  );
}

export default App;
