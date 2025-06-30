'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
  
    await queryInterface.addColumn('users', 'verification_token', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
  
    await queryInterface.removeColumn('users', 'verification_token');
  }
};

