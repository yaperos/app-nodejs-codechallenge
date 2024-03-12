import { kafka } from '@/lib/kafka'
import { Consumer } from 'kafkajs'
// import { Log } from '@/models/log/log.model'
// import { Transaction } from '@/models/transaction/transaction.model'
// import Logger from '../log/logger'

const topic = process.env.TOPIC
const app = process.env.APP_NAME

export const consumer = async (): Promise<Consumer> => {
  const newConsumer = kafka.consumer({ groupId: `${app}` })

  await newConsumer.connect()
  await newConsumer.subscribe({ topic, fromBeginning: true })

  return newConsumer

  // await consumer.run({
  //   eachMessage: async ({ topic, message, partition }) => {
  //     const transaction = JSON.parse(message.value?.toString())
  //     const newTransaction = await Transaction.create(transaction)

  //     const kafka = {
  //       topic,
  //       transaction,
  //       partition,
  //       offset: Number(message.offset),
  //     }
  //     const newLog = await Log.create({
  //       toJSON: kafka,
  //     })

  //     await newLog.save()

  //     await newTransaction.save().catch(async (error) => {
  //       if (error) {
  //         const logSaved = await Log.create({
  //           toJSON: error,
  //         })

  //         await logSaved.save()
  //       }

  //       Logger.info('Record saved.')
  //     })

  //     console.log({
  //       topic,
  //       partition,
  //       value: transaction,
  //       offset: Number(message.offset),
  //     })
  //   },
  // })
}
