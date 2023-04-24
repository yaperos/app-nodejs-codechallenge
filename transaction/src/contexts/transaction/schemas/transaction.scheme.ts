import Joi from 'joi';

export const TransactionScheme = Joi.object({
  accountExternalIdDebit: Joi.string().required(),
  accountExternalIdCredit: Joi.string().required(),
  transferTypeId: Joi.number().required(),
  value: Joi.number().required(),
}).options({ abortEarly: false });
