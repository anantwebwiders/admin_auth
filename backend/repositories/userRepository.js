const BaseRepository = require('./BaseRepository');
const User = require('../models/UserModel');
const { sendError } = require('../utils/helper');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
    console.log('UserRepository initialized with model:', this.model.name);
  }

  async findByEmail(email, res = null) {
    try {
      return await this.model.findOne({
        where: { email },
        attributes: { include: ['password'] }
      });
    } catch (error) {
      console.error('UserRepository.findByEmail Error:', error);
      
      // If res object is passed, send formatted error
      if (res) {
        return sendError(res, 'Error fetching user by email', error.message, 500);
      }

      // Else just throw error for service layer to handle
      throw error;
    }
  }
 // repositories/UserRepository.js
async updateProfile(userId, profileData) {
  try {
    const allowedFields = ['name', 'email', 'mobile', 'gender', 'profile'];
    const filteredData = Object.keys(profileData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = profileData[key];
        return obj;
      }, {});

    return await this.update(userId, filteredData);
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}

}

module.exports = new UserRepository();
