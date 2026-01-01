import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './taskSlice'

const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['tasks/optimisticUpdateTask'],
        ignoredPaths: ['tasks.optimisticUpdates'],
      },
    }),
})

export default store