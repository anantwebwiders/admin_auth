const BaseRepository = require('./BaseRepository');
const { sendError } = require('../utils/helper');
const Product = require('../models/ProductModel');

class ProductRepository extends BaseRepository {
    constructor() {
        super(Product);
    }

    async updateAndReturn(id, data, options = {}) {
  try {
    const [affectedCount] = await this.model.update(data, {
      where: { id },
      ...options
    });

    if (affectedCount === 0) {
      return null; // No record updated
    }

    // Fetch the updated record manually
    const updatedRecord = await this.model.findByPk(id);
    return updatedRecord;

  } catch (error) {
    console.error('Update and Return error:', error);
    throw error;
  }
}
   
}

module.exports = new ProductRepository(); 