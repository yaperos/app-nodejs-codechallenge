import Joi from 'joi';

export const getTransactionValidator = Joi.object().keys({
  transactionExternalId: Joi.string().uuid().required()
});
