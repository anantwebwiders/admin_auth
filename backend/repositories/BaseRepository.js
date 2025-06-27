const { sendError } = require('../utils/helper');

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data, res = null) {
    try {
      return await this.model.create(data);
    } catch (error) {
      console.error('BaseRepository.create Error:', error);
      if (res) return sendError(res, 'Error creating record', error.message);
      throw error;
    }
  }

  async findAll(filter = {}, res = null) {
    try {
      return await this.model.findAll({ where: filter });
    } catch (error) {
      console.error('BaseRepository.findAll Error:', error);
      if (res) return sendError(res, 'Error fetching records', error.message);
      throw error;
    }
  }

  async findById(id, res = null) {
    try {
      return await this.model.findByPk(id,{
         attributes: { exclude: ['password'] } 
      }); // Sequelize method
    } catch (error) {
      console.error('BaseRepository.findById Error:', error);
      if (res) return sendError(res, 'Error fetching record by ID', error.message);
      throw error;
    }
  }

     async update(id, data, options = {}) {
        try {
            const [affectedCount] = await this.model.update(data, {
                where: { id },
                ...options
            });
            return affectedCount > 0;
        } catch (error) {
            console.error('Update error:', error);
            throw error;
        }
    }

    async updateAndReturn(id, data, options = {}) {
        try {
            const [affectedCount, [updatedRecord]] = await this.model.update(data, {
                where: { id },
                returning: true,
                ...options
            });
            return updatedRecord;
        } catch (error) {
            console.error('Update and Return error:', error);
            throw error;
        }
    }
  async delete(id, res = null) {
    try {
      const deletedCount = await this.model.destroy({ where: { id } });
      if (deletedCount === 0) {
        if (res) return sendError(res, 'Record not found for deletion', 'No matching ID', 404);
        return null;
      }
      return deletedCount;
    } catch (error) {
      console.error('BaseRepository.delete Error:', error);
      if (res) return sendError(res, 'Error deleting record', error.message);
      throw error;
    }
  }
}

module.exports = BaseRepository;
