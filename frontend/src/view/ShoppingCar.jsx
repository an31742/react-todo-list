/*
 * @Author: an31742 2234170284@qq.com
 * @Date: 2025-07-03 01:53:52
 * @LastEditors: an31742 2234170284@qq.com
 * @LastEditTime: 2025-07-05 20:27:40
 * @FilePath: /react-todo-list/src/view/ShoppingCar.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useReducer } from "react"
import ProductList from "../components/shoppIngCar/productList"
import ShoppingCart from "../components/shoppIngCar/ShoppingCart"
import "../components/shoppIngCar/shoppingCar.css"
// 初始商品数据   商品数量以及shang'pin
const initialProducts = [
  { id: 1, name: "React入门教程", price: 59.9, stock: 10 },
  { id: 2, name: "JavaScript高级编程", price: 89.9, stock: 5 },
  { id: 3, name: "CSS权威指南", price: 69.9, stock: 8 },
  { id: 4, name: "Node.js实战", price: 79.9, stock: 3 },
  { id: 5, name: "TypeScript精粹", price: 49.9, stock: 12 },
]

//单独写购物车逻辑  购物车调用逻辑这是一个公共状态方法
function cartReducer(state, action) {
  console.log("购物车状态更新", state, action)
  switch (action.type) {
    case "ADD_ITEM":
      //检查是否在购物车中  加入购物车 product 如果购物车里面是否有新的商品
      const existingItem = state.find((item) => item.id === action.payload.id)
      console.log("existingItem", existingItem)
      //如果购物车里面没有商品是独立添加那么就要
      if (existingItem) {
        //当购物车里面有商品在继续加入商品
        //检查库存
        //判断购物车已经存在的商品数量是否小于库存书
        if (existingItem.quantity < existingItem.stock) {
          //那么就判断添加的商品和购物车的商品是是否一致一致就在原来的基础上数量加1，不一致的话就增加一个对象的值
          return state.map((item) => (item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item))
        }
        return state // 库存不足，不添加
      } else {
        // 新商品添加到购物车  直接添加商品   quantity是购物车的上商品数量
        console.log("8888", [...state, { ...action.payload, quantity: 1 }])
        return [...state, { ...action.payload, quantity: 1 }]
      }
    case "REMOVE_ITEM":
      //删除当前的商品 通过filter过滤掉删除当前的商品
      return state.filter((item) => item.id !== action.payload)
    case "UPDATE_QUANTITY":
      console.log("更新数量", state, action.payload) //当增加1或者减少1都会更新数量把数量变为最新
      //更新数量就代表商品一定存在     当前的商品和更新数量的商品是否一致   如果一致就把数量变为最新
      return state.map((item) => (item.id === action.payload.id ? { ...item, quantity: Math.min(Math.max(action.payload.quantity, 1), item.stock) } : item))
    case "CLEAR_CART":
      return []
    default:
      console.log("state", state)
      return state // 默认返回当前状态  这个当前的值就是useReducer 的值
  }
}

function ShoppingCar() {
  // 使用 useReducer 来管理购物车状态
  const [cart, dispatch] = useReducer(cartReducer, [])
  console.log("当前购物车内容:", cart, dispatch)
  // 计算总价  购物车总价的计算
  // 使用 reduce 方法计算总价
  // cart 是购物车数组，item 是购物车中的每个商品对象
  // item.price 是商品价格，item.quantity 是商品数量
  //reduce：是数组的一个方法，用来把数组“归纳”为一个值。
  // sum 是累加器，初始值为 0   map 方法会遍历数组中的每个元素，并将每个元素的 price 和 quantity 相乘，最后将所有的结果相加得到总价。
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return (
    <div className="app">
      <header className="app-header">
        <h1>React购物车学习示例</h1>
      </header>
      <div className="app-container">
        {/* 商品展示 组件 */}
        <ProductList products={initialProducts} cart={cart} dispatch={dispatch} />
        {/* 购物车组件 */}
        <ShoppingCart cart={cart} dispatch={dispatch} totalPrice={totalPrice} />
      </div>
    </div>
  )
}

export default ShoppingCar
