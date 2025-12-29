const { ObjectId } = require('mongodb');

class TodoModel {
  constructor(db) {
    this.collection = db.collection('todos');
  }

  // 创建索引
  async createIndexes() {
    await this.collection.createIndex({ userId: 1 });
    await this.collection.createIndex({ createdAt: -1 });
  }

  // 获取用户的所有todos
  async findByUserId(userId, options = {}) {
    const { skip = 0, limit = 50, sort = { createdAt: -1 } } = options;
    
    return await this.collection
      .find({ userId: new ObjectId(userId) })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  // 创建新todo
  async create(todoData) {
    const todo = {
      ...todoData,
      userId: new ObjectId(todoData.userId),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.collection.insertOne(todo);
    return { ...todo, _id: result.insertedId };
  }

  // 根据ID查找todo
  async findById(id, userId) {
    return await this.collection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    });
  }

  // 更新todo
  async updateById(id, userId, updateData) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(userId) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('Todo not found');
    }

    return await this.findById(id, userId);
  }

  // 删除todo
  async deleteById(id, userId) {
    const result = await this.collection.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    });

    return result.deletedCount > 0;
  }

  // 切换完成状态
  async toggleCompleted(id, userId) {
    const todo = await this.findById(id, userId);
    if (!todo) {
      throw new Error('Todo not found');
    }

    return await this.updateById(id, userId, { completed: !todo.completed });
  }

  // 获取统计信息
  async getStats(userId) {
    const pipeline = [
      { $match: { userId: new ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          pending: { $sum: { $cond: ['$completed', 0, 1] } }
        }
      }
    ];

    const result = await this.collection.aggregate(pipeline).toArray();
    return result[0] || { total: 0, completed: 0, pending: 0 };
  }
}

module.exports = TodoModel;