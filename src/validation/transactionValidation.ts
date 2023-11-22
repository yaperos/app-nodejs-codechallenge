import Joi from "joi";

export const createTransactionSchema = Joi.object({
  accountExternalIdDebit: Joi.string().required(),
  accountExternalIdCredit: Joi.string().required(),
  transferTypeId: Joi.number().integer().required(),
  value: Joi.number().positive().required(),
});

export const getTransactionByIdSchema = Joi.object({
  id: Joi.string().uuid().required(),
}).unknown(true); // permite otrios parmetros
