'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // users table
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products', // products table
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },

      total_price: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      shipping_address: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM('placed', 'shipped', 'delivered', 'cancelled', 'pending'),
        defaultValue: 'placed',
        allowNull: false
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
