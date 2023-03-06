const broker = require("../../infra/broker/broker")
const CheckFraudCommand = require('../../commands/checkFraudCommand')
const dbFrauds = require('../../infra/db/dbFrauds')

exports.subscribe = async () => {
  const consumer = await broker.consumer()
  await consumer.connect()
  await consumer.subscribe({ topics: ['read-transaction'], fromBeginning: true })
  try {
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = {
          topic,
          partition,
          offset: message.offset,
          value: message.value.toString(),
        }
        if (topic === 'read-transaction') {
          const command = new CheckFraudCommand(dbFrauds)
          const response = await command.execute(JSON.parse(data.value))
          console.log('read-transaction', response)
        }
      },
    })
  } catch (error) {
    await consumer.disconnect()
    console.log('consumer error:', error)
  }
}