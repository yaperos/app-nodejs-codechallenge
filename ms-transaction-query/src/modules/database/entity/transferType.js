const { EntitySchema } = require('typeorm');

module.exports.TransferType = new EntitySchema({
  name: 'TransferType',
  tableName: 'transfer_type',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
      length: 255,
    },
  },
  relations: {
    transactions: {
      target: 'Transaction',
      type: 'one-to-many',
      inverseSide: 'transferType',
    },
  },
});
