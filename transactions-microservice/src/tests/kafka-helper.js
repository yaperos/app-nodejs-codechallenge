const { Kafka } = require('kafkajs')

let producer = null
let consumer = null
const messagesReceived = []

const initConsumer = async (kafka, {
  groupId,
  topic,
}) => {
  consumer = kafka.consumer({ groupId })

  await consumer.connect()

  await consumer.subscribe({
    topic,
    fromBeginning: true,
  })

  console.debug('--------------------------------------------------')
  console.debug('Consumer initialized 🍕')
  console.debug('--------------------------------------------------')

  await consumer.run({
    eachMessage: async ({ message }) => {
      const rawMessage = message.value?.toString()
      // console.log('rawMessage', rawMessage)
      if (!rawMessage) {
        return
      }
      try {
        messagesReceived.push(JSON.parse(rawMessage))
      } catch (e) {
        // console.error(e, rawMessage)
        messagesReceived.push(rawMessage)
      }
    },
  })
}

const initProducer = async kafka => {
  producer = kafka.producer()
  await producer.connect()
  return producer
}

const sendMessage = async (topic, message) => {
  try {
    const messageString = JSON.stringify(message)
    await producer.send({
      topic,
      messages: [
        { value: messageString },
      ],
    })
  } catch (e) {
    // console.error(e)
    await producer.send({
      topic,
      messages: [
        { value: message },
      ],
    })
  }
}

const initKafka = async ({
  clientId,
  brokers,
  groupId,
  topic,
}) => {
  const kafka = new Kafka({
    clientId,
    brokers,
  })

  await initConsumer(kafka, { groupId, topic })
  await initProducer(kafka)

  return sendMessage
}

/**
 * Sleep for the specified number of seconds
 *
 * @param {number} seconds - Number of seconds to sleep for
 * @returns {Promise}
 */
const sleep = async seconds => new Promise(resolve => {
  setTimeout(resolve, (seconds * 1000))
})

/**
 * Attempt to find the record with the defined value (needle) within the Array of records (haystack)
 * using the filterFunction provided over the specified number of attempts
 *
 * @param {function} filterFunction - Function used to filter out the required record
 * @param {string|number} key
 * @param {number} attempts - Number of attempts to find the record
 * @returns {Promise<*>}
 */
const eventualQueueMember = async (filterFunction, key, attempts = 5) => {
  // @ts-ignore
  const hits = messagesReceived.filter(filterFunction)
  // const hits = filterFunction(haystack, needle)
  if (hits.length > 0) {
    return hits[0]
  }
  if (attempts === 1) {
    throw new Error(`Failed to get ${key} in queue`)
  }
  await sleep(1)
  return eventualQueueMember(filterFunction, key, attempts - 1)
}

module.exports = {
  eventualQueueMember,
  initKafka,

}
