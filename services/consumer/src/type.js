const avro = require('avcsc');

const avroSchema = {
  name: 'TransactionType',
  type: 'record',
  fields: [
    {
      name: 'transactionStatus',
      type: 'double'
    },
    {
      name: 'transactionValue',
      type: 'double'
    }
  ]
};

const type = avro.parse(avroSchema)

module.exports = type;