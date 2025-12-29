const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

class UserModel {
  constructor(db) {
    this.collection = db.collection('users');
  }

  // 创建索引
  async createIndexes() {
    await this.collection.createIndex({ email: 1 }, { unique: true });
    await this.collection.createIndex({ username: 1 }, { unique: true });
  }

  // 创建用户
  async create(userData) {
    const { username, email, password } = userData;
    
    // 检查用户是否已存在
    const existingUser = await this.collection.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // 加密密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = {
      username,
      email,
      password: hashedPassword,
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

  // 验证密码
  async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  // 更新用户信息
  async updateById(id, updateData) {
    const { password, ...otherData } = updateData;
    
    let updateFields = {
      ...otherData,
      updatedAt: new Date()
    };

    // 如果要更新密码，先加密
    if (password) {
      const saltRounds = 10;
      updateFields.password = await bcrypt.hash(password, saltRounds);
    }

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