const dotenv = require('dotenv')
const { VError } = require('verror')

dotenv.config()

const SERVICE_ENV = {
  NAME: process.env.SERVICE_NAME ?? 'anti-fraud',
}

const BROKER_ENV = {
  CLIENT_ID: process.env.BROKER_CLIENT_ID ?? 'anti-fraud',
  GROUP_ID: process.env.BROKER_GROUP_ID ?? 'anti-fraud',
  INITIAL_RETRY_TIME: +(process.env.BROKER_INITIAL_RETRY_TIME ?? '10000'),

  TOPIC_TRANSACTIONS: process.env.BROKER_TOPIC_TRANSACTIONS ?? 'transactions',
  TOPIC_ANTI_FRAUD: process.env.BROKER_TOPIC_ANTI_FRAUD ?? 'anti-fraud',
}
const brokers = process.env.BROKERS ?? 'localhost:9092'

const config = {
  SERVICE_ENV,
  BROKER_ENV,
}

try {
  const BROKERS = brokers.split(',')
  config.BROKER_ENV.BROKERS = BROKERS
} catch (e) {
  console.error(e)
  const error = /** @type {Error} */ (e)
  throw new VError(error, 'ENVIRONMENT VARIABLES ERROR')
}

module.exports = config
