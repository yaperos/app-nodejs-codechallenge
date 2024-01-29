const router = require('express').Router();

const { SchemaValidator } = require('../../middlewares/SchemaValidator');
const { ValidateToken } = require('../../middlewares/ValidateToken');
const { TransactionController } = require('./controller');
const { TransactionSchema } = require('./schemas');

router.post(
  '/',
  [SchemaValidator(TransactionSchema), ValidateToken],
  TransactionController.createTransaction,
);

router.get(
  '/',
  [ValidateToken],
  TransactionController.getTransaction,
);

module.exports.TransactionRouter = router;
