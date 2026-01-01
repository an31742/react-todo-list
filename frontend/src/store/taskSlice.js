import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// 获取任务
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (projectId) => {
    const response = await axios.get(`/api/tasks?projectId=${projectId}`)
    return response.data
  }
)

// 创建任务
export const createTaskAsync = createAsyncThunk(
  'tasks/createTask',
  async (taskData) => {
    const response = await axios.post('/api/tasks', taskData)
    return response.data
  }
)

// 更新任务
export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      console.log('发送更新请求:', id, updates);
      const response = await axios.put(`/api/tasks/${id}`, updates);
      console.log('更新响应:', response.data);
      return response.data;
    } catch (error) {
      console.error('更新请求失败:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)

// 删除任务
export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId) => {
    await axios.delete(`/api/tasks/${taskId}`)
    return taskId
  }
)

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    onlineUsers: [],
    optimisticUpdates: {} // 改为普通对象
  },
  reducers: {
    optimisticUpdateTask: (state, action) => {
      const { id, updates } = action.payload
      const taskIndex = state.tasks.findIndex(t => t.id === id)
      if (taskIndex !== -1) {
        state.optimisticUpdates[id] = state.tasks[taskIndex] // 使用对象语法
        Object.assign(state.tasks[taskIndex], updates)
      }
    },
    revertOptimisticUpdate: (state, action) => {
      const id = action.payload
      const original = state.optimisticUpdates[id] // 使用对象语法
      if (original) {
        const taskIndex = state.tasks.findIndex(t => t.id === id)
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = original
        }
        delete state.optimisticUpdates[id] // 删除属性
      }
    },
    updateOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    },
    realTimeTaskUpdate: (state, action) => {
      const updatedTask = action.payload
      const taskIndex = state.tasks.findIndex(t => t.id === updatedTask.id)
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = updatedTask
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false
      })
      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.tasks.push(action.payload)
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
        delete state.optimisticUpdates[action.payload.id] // 使用对象语法
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload)
      })
  }
})

export const { optimisticUpdateTask, revertOptimisticUpdate, updateOnlineUsers, realTimeTaskUpdate } = taskSlice.actions

export default taskSlice.reducer