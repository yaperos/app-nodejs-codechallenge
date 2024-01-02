const { BROKER_ENV } = require('../consts')
const { getProducer } = require('../libs/kafka')

/**
 * @param {{transactionExternalId: string, isFraudulent: boolean}} transaction
 */
const notifyAntiFraudResult = async transaction => {
  const producer = await getProducer()
  try {
    const message = JSON.stringify(transaction)
    await producer.send({
      topic: BROKER_ENV.TOPIC_ANTI_FRAUD,
      messages: [
        { value: message },
      ],
    })
  } catch (e) {
    console.error(e)
  }
}

module.exports = {
  notifyAntiFraudResult,
}
