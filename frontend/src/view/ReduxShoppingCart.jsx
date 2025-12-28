import react from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectCartItems, selectTotalPrice, addItem, removeItem, clearCart } from "../redux/reduxShoppingCart/cartSlice"

const Products = ({ id, name, price }) => {
  const dispatch = useDispatch()
  return (
    <div>
      <h3>{name}</h3>
      <p>价格: ${price}</p>
      <button onClick={() => dispatch(addItem({ id, name, price }))}>添加到购物车</button>
    </div>
  )
}

const Cart = () => {
  const items = useSelector(selectCartItems)
  const total = useSelector(selectTotalPrice)
  const dispatch = useDispatch()
  return (
    <div>
      <h2>购物车</h2>
      {items.length === 0 ? (
        <p>购物车为空</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span>
              <span>{item.quantity}</span>
              <button
                style={{
                  marginLeft: 17,
                  color: "red",
                  background: "#eee",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
                onClick={() => dispatch(removeItem(item.id))}
              >
                -
              </button>
              <button
                style={{
                  marginLeft: 17,
                  color: "red",
                  background: "#eee",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
                onClick={() => dispatch(addItem(item))}
              >
                +
              </button>
              <button
                style={{
                  marginLeft: 17,
                  color: "red",
                  background: "#eee",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
                onClick={() => dispatch(removeItem(item))} // 删除商品
              >
                x
              </button>
            </li>
          ))}
        </ul>
      )}
      <p>总价: ${total.toFixed(2)}</p>
      <button
        onClick={() => dispatch(clearCart())} // 删除商品
      >
        清空购物车
      </button>
    </div>
  )
}

export default function ReduxShoppingCart() {
  return (
    <div>
      <div>
        <Products id={1} name="商品A" price={19.99} />
        <Products id={2} name="商品B" price={29.99} />
        <Cart />
      </div>
    </div>
  )
}
