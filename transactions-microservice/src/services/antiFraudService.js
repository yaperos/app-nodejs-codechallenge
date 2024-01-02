const { BROKER_ENV } = require('../consts')
const { getProducer } = require('../libs/kafka')

/**
 * @param {{transactionExternalId: string, transactionTypeId: number, value: number, createdAt: string}} transaction
 */
const notifyNewTransaction = async transaction => {
  const producer = await getProducer()
  try {
    const message = JSON.stringify(transaction)
    await producer.send({
      topic: BROKER_ENV.TOPIC_TRANSACTIONS,
      messages: [
        { value: message },
      ],
    })
  } catch (e) {
    console.error(e)
  }
}

module.exports = {
  notifyNewTransaction,
}
