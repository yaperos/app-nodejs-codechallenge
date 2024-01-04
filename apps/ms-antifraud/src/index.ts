import 'dotenv/config'
import assert from 'assert'
import { EachMessagePayload } from "kafkajs"
import { KafkaConsumerService } from "@common-txn/service"
import { txnDataSource } from "./datasource"
import { Transaction } from '@common-txn/datasource'
import { TxnStatus } from '@common-txn/domain'

async function main() {
  assert.ok(process.env.KAFKA_BROKERS, "Undefined kafka brokers")
  const kafkaBrokers = process.env.KAFKA_BROKERS.split(",")

  assert.ok(process.env.TOPIC_VALIDATE_TXN, "Undefined kafka topic")
  const kafkaTopic = process.env.TOPIC_VALIDATE_TXN

  const consumer = new KafkaConsumerService(
    kafkaTopic,
    kafkaBrokers,
  )

  consumer.setEachMessageHandler(async (payload: EachMessagePayload) => {
    const { message } = payload

    const transactionExternalId = message.key?.toString()
    const txnData = await txnDataSource.manager.findOneBy(Transaction, {
      transactionExternalId
    })

    if (txnData) {
      txnData.transactionStatus = txnData.value > 1000 ? TxnStatus.REJECTED : TxnStatus.APPROVED
      console.log(`Change status ${transactionExternalId} to ${txnData.transactionStatus}`)
      await txnDataSource.manager.save(txnData)
    }
  })

  await consumer.run()
}

txnDataSource
  .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

main()
  .catch((err: Error) => console.error(err.stack || err.message))