const BaseRepository = require('./BaseRepository');
const User = require('../models/UserModel');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
    console.log('UserRepository initialized with model:', this.model.name);
  }

  async findByEmail(email) {
    return await this.model.findOne({
      where: { email },
      attributes: { include: ['password'] }
    });
  }
}



module.exports = new UserRepository();