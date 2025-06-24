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
  }
}, {
  tableName: 'users', // must match your migration table name
  timestamps: true, // adds createdAt and updatedAt
});

// Test the model


module.exports = User;