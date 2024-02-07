import * as Joi from 'joi';

export default Joi.object({
  KAFKA_PORT: Joi.number().required(),
  KAFKA_HOST: Joi.string().required(),
  KAFKA_PRODUCER_SEND_TIMEOUT: Joi.number().default(30000),
});
