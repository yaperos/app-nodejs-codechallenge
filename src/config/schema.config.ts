import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // app
  BASE_ENVIRONMENT: Joi.string().default('DEVELOPMENT'),
  BASE_CONTEXT_PATH: Joi.string().default('api/yape-transactions-ms'),
  COUNTRY_CODE: Joi.string().required(),
  TIME_ZONE: Joi.string().required(),
  APP_PORT: Joi.number().default(8080),
  APP_HOST: Joi.string().default('0.0.0.0'),
  INTERNAL_MICROSERVICES_URL: Joi.string().required(),

  // bd
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required().default('yape_transactions_ms'),

  // kafka
  KAFKA_HOST: Joi.string().required(),
  KAFKA_PORT: Joi.number().required(),
  KAFKA_PRODUCER_SEND_TIMEOUT: Joi.number().default(30000),

  // redis
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required()
});
