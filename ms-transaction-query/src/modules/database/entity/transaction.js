const { EntitySchema } = require('typeorm');

module.exports.Transaction = new EntitySchema({
  name: 'Transaction',
  tableName: 'transaction',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    accountExternalIdDebit: {
      type: 'uuid',
    },
    accountExternalIdCredit: {
      type: 'uuid',
    },
    correlationId: {
      type: 'uuid',
    },
    transferTypeId: {
      type: 'int',
    },
    value: {
      type: 'decimal',
    },
    status: {
      type: 'enum',
      enum: ['pending', 'approved', 'rejected', 'error'],
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    transferType: {
      target: 'TransferType',
      type: 'many-to-one',
      joinColumn: { name: 'transferTypeId' },
      inverseSide: 'transactions',
    },
  },
});
