module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transaction', {
      transactionExternalId: {
        type: Sequelize.STRING(100),
        primaryKey: true
      },
      accountExternalIdDebit: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      accountExternalIdCredit: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      tranferTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      transactionStatusId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      value: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
    await queryInterface.createTable('tranfer_type', {
      tranferTypeId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      }
    });
    await queryInterface.createTable('transaction_status', {
      transactionStatusId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      }
    });
    await queryInterface.bulkInsert('tranfer_type', [
      {
        name: 'credit'
      },
      {
        name: 'debit'
      }
    ]);
    await queryInterface.bulkInsert('transaction_status', [
      {
        name: 'pending'
      },
      {
        name: 'approved'
      },
      {
        name: 'rejected'
      }
    ]);
  }
}