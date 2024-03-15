import * as Joi from 'joi';

export const environmentsValidator = Joi.object({
  NODE_ENV: Joi.string().required(),
  API_KEY: Joi.string().required(),
  APP_NAME: Joi.string().required(),
  TIMEZONE: Joi.string().required(),
  KAFKA_HOST: Joi.string().required(),
  KAFKA_PORT: Joi.number().required(),
  KAFKA_TIMEOUT: Joi.number().required(),
  KAFKA_RETRIES: Joi.number().required(),
  KAFKA_CLIENT_ID: Joi.string().required(),
  KAFKA_GROUP_ID: Joi.string().required(),
  TRANSACTION_TOPIC: Joi.string().required(),
  TRANSACTION_EVALUATED_TOPIC: Joi.string().required(),
});
