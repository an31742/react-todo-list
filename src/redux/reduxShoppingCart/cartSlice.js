import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
  // 定义slice的名称  和pinia 类似定义专门的属性和方法
  name: "cart",
  initialState: {
    items: [], // 购物车商品数组
    totalQuantity: 0, // 商品总数量
    totalPrice: 0, // 商品总价
  },
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload
      const existingItem = state.items.find((item) => item.id === newItem.id)
      if (existingItem) {
        // 已有商品，更新数量和总价
        existingItem.quantity += 1
        existingItem.totalPrice += newItem.price
      } else {
        // 新商品，直接 push 到购物车
        state.items.push({
          ...newItem,
          quantity: 1,
          totalPrice: newItem.price,
        })
      }
      state.totalQuantity += 1
      state.totalPrice += newItem.price
    },
    removeItem: (state, action) => {
      const newItem = action.payload // 新添加的商品
      const existingItem = state.items.find((item) => item.id === newItem.id) // 查找购物车中是否已存在该商品
      if (existingItem) {
        if (existingItem.quantity === 1) {
          // 如果商品数量为1，则从购物车中移除
          state.items = state.items.filter((item) => item.id !== newItem.id)
        } else {
          existingItem.totalQuantity -= 1 // 更新总数量
          existingItem.totalPrice -= existingItem.price // 更新总价
        }
      }
    },
    deleteItem: (state, action) => {
      const id = action.payload
      const existingItem = state.items.find((item) => item.id === id)
      if (existingItem) {
        state.items = state.items.filter((item) => item.id !== id)
        state.totalQuantity -= existingItem.quantity
        state.totalPrice -= existingItem.totalPrice
      }
    },
    clearCart: (state) => {
      state.items = []
      state.totalQuantity = 0
      state.totalPrice = 0
    },
  },
})

// 导出 action creators
export const { addItem, removeItem, deleteItem, clearCart } = cartSlice.actions

// 导出 selector
export const selectCartItems = (state) => state.cart.items
export const selectTotalQuantity = (state) => state.cart.totalQuantity
export const selectTotalPrice = (state) => state.cart.totalPrice

export default cartSlice.reducer
