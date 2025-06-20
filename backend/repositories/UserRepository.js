// repositories/UserRepository.js
const BaseRepository = require('./BaseRepository');
const User = require('../models/UserModel');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    // Add any custom User-specific methods
    async findByEmail(email) {
        return await this.model.findOne({ email });
    }
}

module.exports = new UserRepository();
