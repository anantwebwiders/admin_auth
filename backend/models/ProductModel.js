const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Product = db.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'products',
  timestamps: true
});

Product.associate = (models) => {
  Product.hasMany(models.Order, {
    foreignKey: 'product_id',
    as: 'orders'
  });
};

module.exports = Product;
