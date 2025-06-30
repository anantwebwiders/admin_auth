// db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'admin_node',
  process.env.DB_USER || 'anant',
  process.env.DB_PASS || 123456, 
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: console.log, // Enable logging
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection failed:', err));

module.exports = sequelize; 