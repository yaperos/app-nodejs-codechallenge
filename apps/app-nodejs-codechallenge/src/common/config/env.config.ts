import * as Joi from "joi";

const JoiValidation = Joi.object({
  //Application
  APP_PORT: Joi.number().default(3000),

  //Database main
  DB_HOST: Joi.required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().required().default(false),

  //Kafka
  KAFKA_HOST: Joi.string().required(),
  KAFKA_ID: Joi.string().required(),
  KAFKA_PRODUCER_NAME: Joi.string().required(),
  KAFKA_TOPIC_CREATED: Joi.string().required(),
});

export default JoiValidation;
