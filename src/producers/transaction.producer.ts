import { producer } from '@/lib/kafka/producer'
import { CompressionTypes } from 'kafkajs'
import { ITransaction } from '@/types/transaction.type'

export const ProducerTransaction = async (
  topic: string,
  key: string,
  message: ITransaction
) => {

  const prod = await producer()

  await prod.send({
    topic,
    compression: CompressionTypes.GZIP,
    messages: [
      {
        key,
        value: JSON.stringify(message),
      },
    ],
  })

  await prod.disconnect()
}

