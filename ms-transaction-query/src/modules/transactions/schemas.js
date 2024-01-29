const Joi = require('joi');

const GetTransactionSchema = Joi.object({
  limit: Joi.number().integer().min(1).optional(),
  page: Joi.number().integer().min(1).optional(),
  sortBy: Joi.string().pattern(/^(transactionStatus.name|transactionType.name|value|createdAt|transactionExternalId),(asc|desc)$/).optional(),
  transactionExternalId: Joi.string().optional(),
  'transactionType.name': Joi.string().optional(),
  'transactionStatus.name': Joi.string().valid('pending', 'approved', 'rejected', 'error').optional(),
  createdAt: Joi.date().iso().optional(),
  fields: Joi.array().items(
    Joi.string().valid('transactionStatus.name', 'transactionType.name', 'value', 'createdAt', 'transactionExternalId'),
  ).optional(),
}).with('page', 'limit');

module.exports.GetTransactionSchema = GetTransactionSchema;
