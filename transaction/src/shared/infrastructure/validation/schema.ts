import * as Joi from 'joi';

export const validationSchema = Joi.object({
  BASE_CONTEXT_PATH: Joi.string(),
  APP_PORT: Joi.number().default(8080),

  // broker
  KAFKA_HOST: Joi.string().required(),
  KAFKA_PORT: Joi.number().required(),
  KAFKA_PRODUCER_SEND_TIMEOUT: Joi.number().required(),
});
