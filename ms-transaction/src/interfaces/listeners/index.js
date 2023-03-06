const broker = require("../../infra/broker/broker")
const CheckTransactionCommand = require('../../commands/checkTransactionCommand')
const dbTransactions = require('../../infra/db/dbTransactions')

exports.subscribe = async () => {
  const consumer = await broker.consumer()
  await consumer.connect()
  await consumer.subscribe({ topics: ['check-transaction'], fromBeginning: true }) //
  try {
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = {
          topic,
          partition,
          offset: message.offset,
          value: message.value.toString(),
        }
        if (topic === 'check-transaction') {
          const command = new CheckTransactionCommand(dbTransactions)
          const response = await command.execute(JSON.parse(data.value))
          console.log('check-transaction', response)
        }
      },
    })
  } catch (error) {
    await consumer.disconnect()
    console.log('consumer error:', error)
  }
}
