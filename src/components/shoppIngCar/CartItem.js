/*
 * @Author: an31742 2234170284@qq.com
 * @Date: 2025-07-03 13:17:52
 * @LastEditors: an31742 2234170284@qq.com
 * @LastEditTime: 2025-07-05 20:10:33
 * @FilePath: /react-todo-list/src/components/shoppIngCar/CartItem.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 *
 */
import react from "react"

function CartItem({ item, dispatch }) {
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 1
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: item.id, quantity: newQuantity },
    })
  }

  return (
    <div className="cart-item">
      <div className="item-info">
        <h3>{item.name}</h3>
        <p>价格：￥{item.price}</p>
      </div>
      <div className="item-quantity">
        {/* dispatch 是调用具体的方法和组件 每当嗲用的是偶都会调用 cartReducer */}
        <button onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity - 1 } })}>-</button>
        <input type="number" min="1" max={item.stock} value={item.quantity} onChange={handleQuantityChange}></input>
        <button
          onClick={() =>
            dispatch({
              type: "UPDATE_QUANTITY",
              payload: { id: item.id, quantity: item.quantity + 1 },
            })
          }
        >
          +
        </button>
      </div>
      <div className="item-subtotal">¥{(item.price * item.quantity).toFixed(2)}</div>
      <button className="remove-btn" onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}>
        ×
      </button>
    </div>
  )
}

export default CartItem
