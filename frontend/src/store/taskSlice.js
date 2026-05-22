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
      const response = await axios.put(`/api/tasks/${id}`, updates)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
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

// 拖拽重排序
export const reorderTaskAsync = createAsyncThunk(
  'tasks/reorderTask',
  async ({ taskId, targetIndex, targetStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/tasks/reorder', {
        taskId, targetIndex, targetStatus
      })
      // 重排序成功后重新拉取最新数据，保证客户端状态一致
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
  },
  reducers: {},
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
        const index = state.tasks.findIndex(t => t._id === action.payload._id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload)
      })
      // reorder 成功后由组件主动 refetch，此处不做处理
  }
})

export default taskSlice.reducer
