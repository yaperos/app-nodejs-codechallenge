const Joi = require('joi');

const newTransactionValidationSchema = Joi.object({
  value: Joi.number().integer().required(),
  accountExternalIdDebit: Joi.string().uuid().required(),
  accountExternalIdCredit: Joi.string().uuid().required(),
  transferTypeId: Joi.number().integer().min(1).max(4)
    .required(),
});

const validateNewTransaction = (req, res, next) => {
  const { error } = newTransactionValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  return next();
};

const getTransactionValidationSchema = Joi.object({
  transactionId: Joi.string().uuid().required(),
});

const validateGetTransaction = (req, res, next) => {
  const { error } = getTransactionValidationSchema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  return next();
};

module.exports = {
  validateNewTransaction,
  validateGetTransaction,
};
