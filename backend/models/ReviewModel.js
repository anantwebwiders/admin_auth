const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Review = db.define('Review', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  }
}, {
  tableName: 'reviews',
  timestamps: true
});

Review.associate = (models) => {
  // Review belongs to a User
  Review.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  // Review belongs to a Product
  Review.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'product'
  });
};

module.exports = Review;
