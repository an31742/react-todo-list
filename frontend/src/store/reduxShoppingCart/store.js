import { configureStore } from '@reduxjs/toolkit';

// 简单的购物车reducer
const cartSlice = {
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
  },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
      state.total += action.payload.price;
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.total -= state.items[index].price;
        state.items.splice(index, 1);
      }
    },
  },
};

const store = configureStore({
  reducer: {
    cart: (state = cartSlice.initialState, action) => {
      switch (action.type) {
        case 'cart/addItem':
          return {
            ...state,
            items: [...state.items, action.payload],
            total: state.total + action.payload.price,
          };
        case 'cart/removeItem':
          const newItems = state.items.filter(item => item.id !== action.payload);
          return {
            ...state,
            items: newItems,
            total: newItems.reduce((sum, item) => sum + item.price, 0),
          };
        default:
          return state;
      }
    },
  },
});

export default store;