import { consumer } from '@/lib/kafka/consumer'
import { Log } from '@/models/log/log.model'
import { Transaction } from '@/models/transaction/transaction.model'
import Logger from '../lib/log/logger'

export const AntiFraudConsumer = async () => {

  const antifraudConsumer = await consumer()

  await antifraudConsumer.run({
    eachMessage: async ({ topic, message, partition }) => {
      const transaction = JSON.parse(message.value?.toString())
      const newTransaction = await Transaction.create(transaction)

      const kafkaLog = {
        topic,
        transaction,
        partition,
        offset: Number(message.offset),
      }

      const action = 'updateTransaction'
      
      const newLog = await Log.create({
        toJSON: kafkaLog,
        action
      })

      await newLog.save()

      await newTransaction.updateOne().catch(async (error) => {
        if (error) {
          const logSaved = await Log.create({
            toJSON: error,
            action
          })

          await logSaved.save()
        }

        Logger.info('Record updated.')
      })

      console.log({
        topic,
        partition,
        value: transaction,
        offset: Number(message.offset),
      })
    },
  })
}
