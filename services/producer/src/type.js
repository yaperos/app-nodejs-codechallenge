const avro = require('avsc');

const avroSchema = {
  name: 'SaleType',
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