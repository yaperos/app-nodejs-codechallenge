import dotenv from 'dotenv'

dotenv.config({ path: '././.env' })

export const environmentVariables = {
  port: parseInt(process.env.PORT ?? '8010', 10),
  kafka: {
    transaction_topic: process.env.TRANSACTION_TOPIC ?? 'transaction_topic',
    client_id: process.env.CLIENT_ID ?? 'transaction_integration',
    brokers: [process.env.KAFKA_BROKERS ?? 'kafka:9092']
  }
}
