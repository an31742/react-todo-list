/*
 * @Author: an31742 2234170284@qq.com
 * @Date: 2025-07-03 13:15:47
 * @LastEditors: an31742 2234170284@qq.com
 * @LastEditTime: 2025-07-03 17:16:11
 * @FilePath: /react-todo-list/src/components/shoppIngCar/ShoppingCart.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEort
 */
import react from "react"
import CartItem from "./CartItem"
function ShoppingCart({ cart, dispatch, totalPrice }) {
  return (
    <>
      <div className="shopping-cart">
        <h2>购物车</h2>
        {cart.length === 0 ? (
          <div className="empty-cart">购物车是空的</div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} dispatch={dispatch}></CartItem>
              ))}
            </div>
            <div className="cart-summary">
              <div className="total-price">
                总计: <span>¥{totalPrice.toFixed(2)}</span>
              </div>
              <div className="cart-actions">
                <button className="clear-btn" onClick={() => dispatch({ type: "CLEAR_CART" })}>
                  清空购物车
                </button>
                <button className="checkout-btn">结算</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default ShoppingCart
