const { use } = require('express/lib/application');
const UserModel = require('../../models/mongoose/User');

/* Define Class User Service */
class UserService {
  // Function used to get all of the users
  static async getAllUsers() {
    return UserModel.find({}).sort({ createdAt: -1 }).exec();
  }

  // Function used to get user by Given user Id
  static async getOneUser(userId) {
    return UserModel.findById(userId).exec();
  }

  // Function used to create new user
  static async create(data) {
    const user = new UserModel(data);
    return user.save();
  }

  // Function used to update user
  static async update(userId, data) {
    //   Fetch User frist
    const user = await UserModel.findById(userId).exec();
    user.email = data.email;
    // Update Password iif it was modified
    if (data.password) {
      user.password = data.password;
    }

    return user.save();
  }

  // Function used to remove user
  static async remove(userId) {
    return UserModel.deleteOne({ _id: userId }).exec();
  }
}

module.exports = UserService;
