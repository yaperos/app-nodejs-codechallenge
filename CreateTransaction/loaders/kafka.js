const { Kafka, logLevel } = require(`kafkajs`)
const config = require(`@config`)
const { kafka } = config.services
const { brokers, username, password } = kafka

class KafkaT {
  constructor () {
    this.connected = false
    this.connection = null
    this.channel = null
  }

  startConnection () {
    if (this.connected) return this.connection
    else {

      // Create the client with the broker list
      const sasl = username && password ? { username, password, mechanism: `plain` } : null
      const ssl = !!sasl

      this.connection = new Kafka({
        clientId: `create-transaction-service`,
        brokers,
        ssl,
        sasl,
        logLevel: logLevel.NOTHING
      })
      this.connected = true

      return this.connection
    }
  }

  getConnection () {
    return this.connection
  }
}

module.exports = new KafkaT()
