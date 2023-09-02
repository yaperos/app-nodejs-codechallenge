'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      accountExternalIdDebit: {
        type: Sequelize.UUID,
        allowNull: false
      },
      accountExternalIdCredit: {
        type: Sequelize.UUID,
        allowNull: false
      },
      transferTypeId: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status:{
        type: Sequelize.ENUM,
        values: ['PENDING', 'APPROVED', 'REJECTED'],
        defaultValue: 'PENDING',
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
    await queryInterface.dropTable('transactions');
  }
};