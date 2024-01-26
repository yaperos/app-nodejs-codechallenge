const Joi = require('joi');
const createError = require('http-errors');

const getJoiError = ({ details }) => {
  const { message } = details[0];
  return { message: message.replaceAll(' ', '_').replaceAll('"', '') };
};

module.exports.SchemaValidator = (schema, check = 'body') => (req, _res, next) => {
  try {
    if (Joi.isSchema(schema)) {
      const { error, value } = schema.validate(req[check], { abortEarly: false });
      if (error) {
        throw createError(400, getJoiError(error).message);
      } else {
        req[check] = value;
        next();
      }
    } else throw createError(500, 'Schema is not a Joi schema');
  } catch (error) {
    next(error);
  }
};
