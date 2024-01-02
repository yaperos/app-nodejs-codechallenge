const Joi = require('joi')

const createTransferSchema = {
  Body: Joi.object({
    accountExternalIdDebit: Joi.string().guid().required(),
    accountExternalIdCredit: Joi.string().guid().required(),
    transferTypeId: Joi.number().required(),
    value: Joi.number().disallow(0).precision(2).required()
      .prefs({ convert: false }),
  }).required(),
}

const getTransactionSchema = {
  Params: Joi.object({
    transactionExternalId: Joi.string().guid().required(),
  }).required(),
}

module.exports = {
  createTransferSchema,
  getTransactionSchema,
}
