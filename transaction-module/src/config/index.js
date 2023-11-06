import dotenv from 'dotenv'

dotenv.config({ path: './transaction-module/.env' })

export const environmentVariables = {
  port: parseInt(process.env.PORT ?? '8010', 10),
  database: {
    user: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_NAME_DEV,
    host: process.env.DB_HOST_DEV,
    port: process.env.DB_PORT_DEV,
    dialect: 'mysql'
  },
  kafka: {
    transaction_topic: process.env.TRANSACTION_TOPIC ?? 'transaction_topic',
    client_id: process.env.CLIENT_ID ?? 'transaction_integration',
    brokers: [process.env.KAFKA_BROKERS ?? 'kafka:9092']
  }
}
