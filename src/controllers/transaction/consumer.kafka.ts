import { Consumer } from "kafkajs"
import { sendCreateGraphql, sendUpdateGraphql } from "./transaction.dao"


 export const consumerTransactionCreate = async (consumer:Consumer) =>
 {
  await consumer.connect()
  const topic = process.env.TOPIC_TRANSACTION_CREATE || ''
  await consumer.subscribe({ topic, fromBeginning: true })
  return  consumer.run({
  eachMessage: async ({ topic, message, partition }) => {
    const transaction = JSON.parse(message.value?.toString() || '')

    const kafka = {
      topic,
      transaction,
      partition,
      offset: Number(message.offset),
    }

    sendCreateGraphql(transaction)
    console.log(kafka)
  },
})

}



export const consumerTransactionApproved = async (consumer:Consumer) =>
 {
      const topic = process.env.TOPIC_TRANSACTION_APPROVED || ''
      await consumer.subscribe({ topic, fromBeginning: true })
      return  consumer.run({
      eachMessage: async ({ topic, message, partition }) => {
        const transacion = JSON.parse(message.value?.toString() || '')
        const kafka = {
          topic,
          transacion,
          partition,
          offset: Number(message.offset),
        }
        sendUpdateGraphql('approved',transacion.id)
   console.log(kafka)
 },
})

}


export const consumerTransactionRejected = async (consumer:Consumer) =>
 {
      const topic = process.env.TOPIC_TRANSACTION_REJECTED || ''
      await consumer.subscribe({ topic, fromBeginning: true })
      return  consumer.run({
      eachMessage: async ({ topic, message, partition }) => {
        const transacion = JSON.parse(message.value?.toString() || '')
        const kafka = {
          topic,
          transacion,
          partition,
          offset: Number(message.offset),
        }
        sendUpdateGraphql('rejected',transacion.id)
   console.log(kafka)
 },
})

}


