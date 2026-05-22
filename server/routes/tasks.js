const express = require("express")
const router = express.Router()
const TaskCRUD = require("../mongoDb/taskCRUD")

// 获取任务列表（按 order 排序）
router.get("/", async (req, res) => {
  try {
    const { projectId } = req.query
    const taskCRUD = await new TaskCRUD().init()
    const tasks = await taskCRUD.findTasks(projectId)
    res.json(tasks)
  } catch (error) {
    console.error("获取任务失败:", error)
    res.status(500).json({ error: "服务器内部错误" })
  }
})

// 创建新任务（自动分配 order）
router.post("/", async (req, res) => {
  try {
    const taskCRUD = await new TaskCRUD().init()
    const newTask = await taskCRUD.createTask(req.body)
    res.status(201).json(newTask)
  } catch (error) {
    console.error("创建任务失败:", error)
    res.status(500).json({ error: "服务器内部错误" })
  }
})

// 拖拽重排序（核心 — 必须放在 /:id 之前，避免被匹配为 id）
router.put("/reorder", async (req, res) => {
  try {
    const { taskId, targetIndex, targetStatus } = req.body

    if (!taskId || targetIndex === undefined || !targetStatus) {
      return res.status(400).json({ error: "缺少必要参数: taskId, targetIndex, targetStatus" })
    }

    const taskCRUD = await new TaskCRUD().init()
    const result = await taskCRUD.reorderTasks(taskId, targetIndex, targetStatus)
    res.json(result)
  } catch (error) {
    console.error("重排序失败:", error)
    if (error.message === "任务未找到") {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: "服务器内部错误" })
    }
  }
})

// 更新单个任务
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const taskCRUD = await new TaskCRUD().init()
    const success = await taskCRUD.updateTask(id, req.body)

    if (success) {
      // 返回更新后的任务
      const { ObjectId } = require("mongodb")
      const updated = await taskCRUD.collection.findOne({ _id: new ObjectId(id) })
      res.json(updated)
    } else {
      res.status(404).json({ error: "任务未找到" })
    }
  } catch (error) {
    console.error("更新任务失败:", error)
    res.status(500).json({ error: "服务器内部错误" })
  }
})

// 删除任务
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const taskCRUD = await new TaskCRUD().init()
    const success = await taskCRUD.deleteTask(id)

    if (success) {
      res.json({ success: true })
    } else {
      res.status(404).json({ error: "任务未找到" })
    }
  } catch (error) {
    console.error("删除任务失败:", error)
    res.status(500).json({ error: "服务器内部错误" })
  }
})

module.exports = router
