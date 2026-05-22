const { connectToDatabase } = require("./db")
const { ObjectId } = require("mongodb")

class TaskCRUD {
  constructor(collectionName = "tasks") {
    this.collectionName = collectionName
    this.db = null
    this.collection = null
  }

  async init() {
    this.db = await connectToDatabase()
    this.collection = this.db.collection(this.collectionName)
    console.log(`✅ TaskCRUD 初始化成功，集合：${this.collectionName}`)
    return this
  }

  // 按 projectId 查询任务，按 order 升序排列
  async findTasks(projectId) {
    const query = projectId ? { projectId } : {}
    return this.collection.find(query).sort({ order: 1 }).toArray()
  }

  // 创建任务，自动分配 order（当前列最后一个）
  async createTask(taskData) {
    const status = taskData.status || "todo"
    const projectId = taskData.projectId || "project1"

    // 找到当前列最大的 order
    const lastTask = await this.collection
      .find({ status, projectId })
      .sort({ order: -1 })
      .limit(1)
      .toArray()

    const newOrder = lastTask.length > 0 ? lastTask[0].order + 1 : 0

    const task = {
      ...taskData,
      projectId,
      order: newOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await this.collection.insertOne(task)
    return { ...task, _id: result.insertedId }
  }

  // 更新单个任务（跨列移动时自动分配 order）
  async updateTask(id, updateData) {
    const updateFields = { ...updateData, updatedAt: new Date() }

    // 如果状态改变（跨列移动），自动分配目标列的最大 order + 1
    if (updateData.status) {
      const task = await this.collection.findOne({ _id: new ObjectId(id) })
      if (task && task.status !== updateData.status) {
        const lastTask = await this.collection
          .find({ status: updateData.status, projectId: task.projectId })
          .sort({ order: -1 })
          .limit(1)
          .toArray()
        updateFields.order = lastTask.length > 0 ? lastTask[0].order + 1 : 0
      }
    }

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    )
    return result.modifiedCount > 0
  }

  // 删除任务，同时重整同列剩余任务的 order
  async deleteTask(id) {
    const task = await this.collection.findOne({ _id: new ObjectId(id) })
    if (!task) return false

    const { projectId, status } = task
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount > 0) {
      // 重整同列剩余任务的 order
      const remaining = await this.collection
        .find({ status, projectId })
        .sort({ order: 1 })
        .toArray()

      const updates = remaining.map((t, i) => ({
        updateOne: {
          filter: { _id: t._id },
          update: { $set: { order: i, updatedAt: new Date() } },
        },
      }))

      if (updates.length > 0) {
        await this.collection.bulkWrite(updates)
      }
    }

    return result.deletedCount > 0
  }

  // 核心：拖拽重排序
  // taskId: 被拖动的任务 ID
  // targetIndex: 目标位置（从 0 开始）
  // targetStatus: 目标列（todo / inProgress / done）
  async reorderTasks(taskId, targetIndex, targetStatus) {
    const task = await this.collection.findOne({ _id: new ObjectId(taskId) })
    if (!task) throw new Error("任务未找到")

    const projectId = task.projectId
    const oldStatus = task.status
    const isCrossColumn = oldStatus !== targetStatus

    // 获取目标列所有任务（排除自身，按 order 排序）
    const targetQuery = isCrossColumn
      ? { status: targetStatus, projectId }
      : { status: oldStatus, projectId, _id: { $ne: new ObjectId(taskId) } }

    const targetTasks = await this.collection
      .find(targetQuery)
      .sort({ order: 1 })
      .toArray()

    // 插入到目标位置
    targetTasks.splice(targetIndex, 0, {
      ...task,
      status: targetStatus,
    })

    // 批量更新目标列所有任务的 order 和 status
    const targetUpdates = targetTasks.map((t, i) => ({
      updateOne: {
        filter: { _id: t._id },
        update: { $set: { order: i, status: targetStatus, updatedAt: new Date() } },
      },
    }))

    if (targetUpdates.length > 0) {
      await this.collection.bulkWrite(targetUpdates)
    }

    // 如果是跨列移动，重新排列旧列剩余任务的 order
    if (isCrossColumn) {
      const remainingOld = await this.collection
        .find({ status: oldStatus, projectId })
        .sort({ order: 1 })
        .toArray()

      const oldColumnUpdates = remainingOld.map((t, i) => ({
        updateOne: {
          filter: { _id: t._id },
          update: { $set: { order: i, updatedAt: new Date() } },
        },
      }))

      if (oldColumnUpdates.length > 0) {
        await this.collection.bulkWrite(oldColumnUpdates)
      }
    }

    return { success: true }
  }
}

module.exports = TaskCRUD
