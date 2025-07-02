function ToDoList(props){
  console.log('props',props)
  //  子组件拿到父组件里面的值
  const {list =[]}=props
  return (
    <ul>
      {list.map((item) => (
        <li
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          key={item.id}
        >
          {item.text}{" "}
        </li>
      ))}
    </ul>
  );
}
export default ToDoList;