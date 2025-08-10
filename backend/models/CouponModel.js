const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Coupon = db.define('Coupon', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  discount_percent: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  }
}, {
  tableName: 'coupons',
  timestamps: true
});

module.exports = Coupon;
