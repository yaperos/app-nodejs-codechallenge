import dotenv from 'dotenv'

dotenv.config({ path: './antifraud-module/.env' })

export const environmentVariables = {
  port: parseInt(process.env.PORT ?? '8010', 10),
  kafka: {
    transaction_topic: process.env.TRANSACTION_TOPIC ?? 'transaction_topic',
    client_id: process.env.CLIENT_ID ?? 'transaction_integration',
    brokers: String(process.env.KAFKA_BROKERS ?? '').split(',') ?? ['kafka:9092']
  }
}
