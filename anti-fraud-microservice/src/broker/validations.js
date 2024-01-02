const Joi = require('joi')
const validator = require('../utils/joiValidator')

const transactionSchema = Joi.object({
  transactionExternalId: Joi.string().guid().required(),
  transactionTypeId: Joi.number().required(),
  value: Joi.number().required(),
  createdAt: Joi.date().iso().required(),
}).required()

const validateTransaction = validator(transactionSchema)

module.exports = {
  validateTransaction,
}
