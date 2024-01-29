const Joi = require('joi');

const TransactionSchema = Joi.object({
  accountExternalIdDebit: Joi.string().guid({ version: 'uuidv4' }).required(),
  accountExternalIdCredit: Joi.string().guid({ version: 'uuidv4' }).required(),
  transferTypeId: Joi.number().integer().required().min(1)
    .max(3),
  value: Joi.number().positive().required(),
});

module.exports = { TransactionSchema };
