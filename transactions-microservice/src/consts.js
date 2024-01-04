const dotenv = require('dotenv')
const { VError } = require('verror')

dotenv.config()

const SERVER_ENV = {
  NAME: process.env.SERVER_NAME ?? 'transactions',
  PORT: process.env.PORT ?? '8000',
}

const STATUS_TYPES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

const TRANSACTION_TYPES = {
  TRANSFER: 'transfer',
  PAYMENT: 'payment',
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
}

const BROKER_ENV = {
  CLIENT_ID: process.env.BROKER_CLIENT_ID ?? 'transactions-app',
  GROUP_ID: process.env.BROKER_GROUP_ID ?? 'transactions-app',
  INITIAL_RETRY_TIME: +(process.env.BROKER_INITIAL_RETRY_TIME ?? '10000'),

  TOPIC_TRANSACTIONS: process.env.BROKER_TOPIC_TRANSACTIONS ?? 'transactions',
  TOPIC_ANTI_FRAUD: process.env.BROKER_TOPIC_ANTI_FRAUD ?? 'anti-fraud',
}
const brokers = process.env.BROKERS ?? 'localhost:9092'

try {
  const BROKERS = brokers.split(',')
  BROKER_ENV.BROKERS = BROKERS
} catch (e) {
  console.error(e)
  const error = /** @type {Error} */ (e)
  throw new VError(error, 'ENVIRONMENT VARIABLES ERROR')
}

module.exports = {
  SERVER_ENV,
  TRANSACTION_TYPES,
  STATUS_TYPES,
  BROKER_ENV,
}
