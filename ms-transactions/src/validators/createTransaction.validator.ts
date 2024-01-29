import Joi from 'joi';
import { CreateTransactionRequest } from '../requests/CreateTransactionRequest';

export const createTransactionValidator =
  Joi.object<CreateTransactionRequest>().keys({
    accountExternalIdCredit: Joi.string().uuid().required(),
    accountExternalIdDebit: Joi.string().uuid().required(),
    tranferTypeId: Joi.number().required(),
    value: Joi.number().required()
  });
