
import { useState, useMemo } from "react";
function ToDoInput(props) {
  // 通过props 能够拿到父组件的值还有父组件的方法
  const {addToDo}=props
  const [text, setText] = useState('')
  function addToDoHandler(){
    addToDo(text)
    setText('')
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 点击子组件将子组件的里面的数据传给父组件 */}
      <input value={text} onChange={(e) => setText(e.target.value)} />
      {/* 点击子组件将子组件的里面的数据传给父组件 */}
      <span onClick={addToDoHandler}>增加待办事项</span>
    </div>
  );
}

export default ToDoInput
