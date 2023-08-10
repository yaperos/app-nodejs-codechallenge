import * as Joi from 'joi';

// Define un esquema de validación utilizando el módulo Joi
export const configValidationSchema = Joi.object({
  // STAGE debe ser una cadena no vacía y es requerida
  STAGE: Joi.string().required(),

  // POSTGRES_HOST debe ser una cadena no vacía y es requerida
  POSTGRES_HOST: Joi.string().required(),

  // POSTGRES_PORT debe ser un número con valor predeterminado 5432 y es requerido
  POSTGRES_PORT: Joi.number().default(5432).required(),

  // POSTGRES_USERNAME debe ser una cadena no vacía y es requerida
  POSTGRES_USERNAME: Joi.string().required(),

  // POSTGRES_PASSWORD puede ser una cadena vacía o nula
  POSTGRES_PASSWORD: Joi.string().allow(null, ''),

  // POSTGRES_DATABASE debe ser una cadena no vacía y es requerida
  POSTGRES_DATABASE: Joi.string().required(),
});
