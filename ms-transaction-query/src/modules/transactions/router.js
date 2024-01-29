const router = require('express').Router();

const { SchemaValidator } = require('../../middlewares/SchemaValidator');
const { TransactionController } = require('./controller');
const { GetTransactionSchema } = require('./schemas');

router.get(
  TransactionController.BASE_URL,
  [SchemaValidator(GetTransactionSchema, 'query')],
  TransactionController.getTransactions,
);

module.exports.TransactionRouter = router;
