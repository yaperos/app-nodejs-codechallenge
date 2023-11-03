'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('transactions', {
      transaction_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      accountExternalIdDebit: {
        type: DataTypes.STRING,
        allowNull: false
      },
      accountExternalIdCredit: {
        type: DataTypes.STRING,
        allowNull: false
      },
      transferTypeId: {
        type: DataTypes.STRING(2)
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      updatedAt: DataTypes.DATE,
      createdAt: DataTypes.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions')
  }
}
