import 'dotenv/config'
import assert from 'assert'
import { EachMessagePayload } from "kafkajs"
import { KafkaConsumerService } from "@common-txn/service"
import { txnDataSource } from "./datasource"
import { Transaction } from '@common-txn/datasource'
import { TxnStatus } from '@common-txn/domain'
import { createCommonLogger } from '@common-txn/logger'

const logger = createCommonLogger(process.stdout)

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
      logger.info(`Changed status ${transactionExternalId} to ${txnData.transactionStatus}`)
      await txnDataSource.manager.save(txnData)
    }
  })

  process.send && process.send("ready")
  await consumer.run()
    .then(() => logger.info("[server]: MS is running"))

  for(const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      logger.info(`${signal} signal received: closing ms`)
      consumer.stop()
        .then(() => process.exit())
        .catch(() => process.exit(1))
    })
  }
}

txnDataSource
  .initialize()
    .then(() => {
        logger.info("Data Source has been initialized!")
    })
    .catch((err) => {
        logger.error("Error during Data Source initialization:", err)
    })

main()
  .catch((err: Error) => logger.error(err.stack || err.message))