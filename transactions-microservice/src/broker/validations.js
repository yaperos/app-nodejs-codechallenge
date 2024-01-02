const Joi = require('joi')
const { simpleValidator } = require('../utils/joiValidator')

const transactionSchema = Joi.object({
  transactionExternalId: Joi.string().guid().required(),
  isFraudulent: Joi.boolean().required(),
}).required()

const validateAntiFraudResponse = simpleValidator(transactionSchema)

module.exports = {
  validateAntiFraudResponse,
}
