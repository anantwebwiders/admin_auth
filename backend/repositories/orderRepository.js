const BaseRepository = require('./BaseRepository');
const { sendError } = require('../utils/helper');
const Order = require('../models/OrderModel');

class OrderRepository extends BaseRepository {
    constructor() {
        super(Order);
    }

    // repositories/OrderRepository.js
async findAllWithProducts(filter = {}, res = null) {
  try {
    return await this.model.findAll({
      where: filter,
      include: [
        {
          model: this.model.sequelize.models.Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'stock']
        }
      ]
    });
  } catch (error) {
    console.error('OrderRepository.findAllWithProducts Error:', error);
    if (res) return sendError(res, 'Error fetching orders', error.message);
    throw error;
  }
}



}

module.exports = new OrderRepository();