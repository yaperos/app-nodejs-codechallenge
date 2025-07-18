/**
 * Environment variables configuration loader
 * Loads configuration from environment variables
 */
export default () => {
  return {
    environment: process.env.NODE_ENV || 'development',

    application: {
      'trx-types': {
        '220': process.env.TRX_TYPE_220,
        '225': process.env.TRX_TYPE_225,
        '320': process.env.TRX_TYPE_320,
        '325': process.env.TRX_TYPE_325
      },
      'trx-statuses': {
        pending: process.env.TRX_STATUS_PENDING,
        approved: process.env.TRX_STATUS_APPROVED,
        rejected: process.env.TRX_STATUS_REJECTED
      }
    },
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: process.env.DATABASE_SSL === 'true'
    },
    server: {
      port: parseInt(process.env.SERVER_PORT || '3000', 10)
    },
    logging: {
      level: process.env.LOG_LEVEL
    },
    security: {
      jwtSecret: process.env.JWT_SECRET,
      corsOrigin: process.env.CORS_ORIGIN
    },
    kafka: {
      bootstrapServers: process.env.KAFKA_BOOTSTRAP_SERVERS,
      producer: {
        topic: process.env.KAFKA_PRODUCER_TOPIC
      },
      consumer: {
        groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
        topic: process.env.KAFKA_CONSUMER_TOPIC,
        fromBeginning: process.env.KAFKA_CONSUMER_FROM_BEGINNING === 'true' || false,
        autoCommit: process.env.KAFKA_CONSUMER_AUTO_COMMIT === 'true' || false,
      }
    }
  };
};
