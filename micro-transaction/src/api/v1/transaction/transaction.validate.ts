import * as Joi from 'joi';
import { REQUEST_TRANSACTION } from './transaction.interface';

const transactionSchema = Joi.object({
  tranferTypeId: Joi.number().required(),
  accountExternalIdDebit: Joi.string().when('tranferTypeId', {is: 1, then: Joi.required(), otherwise: Joi.string().allow(null)}),
  accountExternalIdCredit: Joi.string().when('tranferTypeId', {is: 2, then: Joi.required(), otherwise: Joi.string().allow(null)}),
  value: Joi.number().required(),
});

export const transactionValidate = (transaction: REQUEST_TRANSACTION) => {
  return transactionSchema.validate(transaction);
};
