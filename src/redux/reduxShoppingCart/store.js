import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./cartSlice"

const store = configureStore({
  reducer: {
    cart: cartReducer, // 这里的 key 必须是 cart
  },
})

export default store
