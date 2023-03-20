const dotenv = require(`dotenv`)

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
  port: parseInt(process.env.NODE_PORT, 10),

  verifyToken: process.env.VERIFY_TOKEN,

  /**
   * API configs
   */
  api: {
    prefix: '/api',
    routeService: process.env.ROUTE_SERVICE
  },

  /**
   * Used by winston logger
   */
   logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  messageError: process.env.ERROR_MESSAGE,
  

  /**
   * Environment External Services
   */
  services: {
    redis: {
      type: process.env.REDIS_CONNECTION,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD
    },
    kafka: {
      brokers: process.env.KAFKA_BROKERS.split(`,`),
      username: process.env.KAFKA_USERNAME,
      password: process.env.KAFKA_PASSWORD,
      topicInputCreateTransaction: process.env.TOPIC_INPUT_CREATE_TRANSACTION,
      topicInputRetrieveTransaction: process.env.TOPIC_INPUT_RETRIEVE_TRANSACTION
    }

  }
}