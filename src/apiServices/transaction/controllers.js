const { response, request } = require('express')
const kafka = require('kafka-node')
const Transaction = require('./model')
const transaction = async (req = request, res = response) => {
  const body = req.body
  const {
    accountExternalIdDebit,
    accountExternalIdCredit,
    tranferTypeId,
    value
  } = body
  const transaction = new Transaction({
    accountExternalIdDebit,
    accountExternalIdCredit,
    tranferTypeId,
    value
  })
  try {
    const client = new kafka.KafkaClient({ kafkaHost: '127.0.0.1:9092' })
    const Producer = kafka.Producer
    const producer = new Producer(client)
    producer.on('ready', () => {
      producer.send(
        [
          {
            topic: 'yape-challenge',
            messages: JSON.stringify(transaction)
          }
        ],
        (err, data) => {
          err ? console.log(err) : console.log(data)
        }
      )
    })
    await transaction.save()
    res.json({
      transaction
    })
  } catch (e) {
    console.log(e)
    res.json({
      error: 'faltan argumentos o el value pasa los 1000'
    })
  }
}

module.exports = transaction
