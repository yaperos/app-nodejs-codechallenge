const serviceDao = require('../services/dao')
const producer = require('../services/producer')

const resolvers = {
  Query: {

    getTransfers: async () => {
      const transfers = await serviceDao.findAll();

      return transfers;
    },
  },
  Mutation: {
    createTransaction: async (_, { id_type, account_external_id_debit, account_external_id_credit, value }) => {
      const msg = value > 1000 ? 0 : 1
      const transaction = { id_type, account_external_id_debit, account_external_id_credit, value}
      const result = await serviceDao.createTransaction(transaction)
      sendMessage('pending')
      
      if (msg === 1) {
        result.status="approved"
        let res = await serviceDao.updateTransaction(result)
        sendMessage('approved')
        return res
      } else {
        result.status='rejected'
        let res = await serviceDao.updateTransaction(result)
        sendMessage('rejected')
        return res
      }

    }
  }
};

function sendMessage(message) {
  const payload = [{ topic: "yape", messages: message }];
  producer.producer.send(payload, function (error, result) {
    console.log("Enviando payload a Kafka");
    if (error) {
      console.log("Envio payload fallo: ", error);
    } else {
      console.log("Resultado de payload:", result);
    }
  });
}

module.exports = resolvers;
