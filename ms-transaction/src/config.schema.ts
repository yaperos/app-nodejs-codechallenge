import * as Joi from 'joi';
export const configValidationSchema = Joi.object({
  STAGE: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432).required(),
  POSTGRES_USERNAME: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().allow(null, ''),
  POSTGRES_DATABASE: Joi.string().required(),
});
