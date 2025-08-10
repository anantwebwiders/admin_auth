const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Order = db.define('Order', {
 order_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },

  total_price: {
    type: DataTypes.FLOAT,
    allowNull: true
  },

  shipping_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM('placed', 'shipped', 'delivered', 'cancelled', 'pending'),
    defaultValue: 'pending',
    allowNull: false
  }
}, {
  tableName: 'orders',
  timestamps: true,
});

Order.associate = (models) => {
  // Order belongs to a User
  Order.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  // Order belongs to a Product
  Order.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'product'
  });
};


module.exports = Order;
