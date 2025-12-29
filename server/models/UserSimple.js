const { ObjectId } = require('mongodb');

class UserModel {
  constructor(db) {
    this.collection = db.collection('users');
  }

  // 创建索引
  async createIndexes() {
    try {
      await this.collection.createIndex({ email: 1 }, { unique: true });
      await this.collection.createIndex({ username: 1 }, { unique: true });
    } catch (error) {
      console.log('Index creation warning:', error.message);
    }
  }

  // 创建用户 (简化版，不加密密码)
  async create(userData) {
    const { username, email, password } = userData;
    
    // 检查用户是否已存在
    const existingUser = await this.collection.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = {
      username,
      email,
      password, // 注意：生产环境中应该加密密码
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    const result = await this.collection.insertOne(user);
    const { password: _, ...userWithoutPassword } = user;
    
    return { ...userWithoutPassword, _id: result.insertedId };
  }

  // 根据邮箱查找用户
  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }

  // 根据用户名查找用户
  async findByUsername(username) {
    return await this.collection.findOne({ username });
  }

  // 根据ID查找用户
  async findById(id) {
    const user = await this.collection.findOne({ _id: new ObjectId(id) });
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  // 验证密码 (简化版，直接比较)
  async validatePassword(user, password) {
    return user.password === password; // 注意：生产环境中应该使用加密比较
  }

  // 更新用户信息
  async updateById(id, updateData) {
    const updateFields = {
      ...updateData,
      updatedAt: new Date()
    };

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      throw new Error('User not found');
    }

    return await this.findById(id);
  }

  // 删除用户
  async deleteById(id) {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}

module.exports = UserModel;