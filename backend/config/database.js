require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'admin_node',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql' // or 'postgres', 'sqlite', etc.
  },
  test: {
    // test environment config
  },
  production: {
    // production environment config
  }
}; 