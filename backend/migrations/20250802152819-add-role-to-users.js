'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user',
    });

    // If you want to enforce ENUM-like behavior in SQL (Postgres or MySQL), 
    // you must use Sequelize.ENUM
    // Uncomment this instead if you're using ENUM in database:
    /*
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.ENUM('admin', 'seller', 'user'),
      allowNull: false,
      defaultValue: 'user',
    });
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'role');
  }
};
