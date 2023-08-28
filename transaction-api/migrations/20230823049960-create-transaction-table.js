/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transaction', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      value: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        defaultValue: 'PENDING',
        allowNull: false,
      },
      accountExternalIdDebit: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      accountExternalIdCredit: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      transferTypeId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('transaction', {
      fields: ['transferTypeId'],
      type: 'foreign key',
      name: 'fk_transaction_transfer_type',
      references: {
        table: 'transfer_type',
        field: 'id',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('transaction');
  },
};
