'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users', // References the Users table
            key: 'id',
          },
          onDelete: 'CASCADE',
      },
      boxSelected: {
        type: Sequelize.INTEGER
      },
      isWinner: {
        type: Sequelize.BOOLEAN
      },
      prizeAmount: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('Transactions');
  }
};