// models/UserModel.js
const { DataTypes } = require('sequelize');
const db = require('../config/db');

const User = db.define('User', {
  // Model attributes
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profile: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  verification_token: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
    role: {
    type: DataTypes.ENUM('admin', 'seller', 'user'), // 👈 Add this
    allowNull: false,
    defaultValue: 'user',
  },
}, {
  tableName: 'users', // must match your migration table name
  timestamps: true, // adds createdAt and updatedAt
});

// Test the model
User.associate = (models) => {
  User.hasMany(models.Order, {
    foreignKey: 'user_id',
    as: 'orders'
  });
};

module.exports = User;