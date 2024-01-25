const router = require("express").Router();

const { MassiveTransactionSchema, TransactionSchema } = require("./schemas");
const { SchemaValidator } = require("../../middlewares/SchemaValidator");
const { TransactionController } = require("./controller");

router.post(
  "/",
  [SchemaValidator(TransactionSchema)],
  TransactionController.createTransaction
);

router.post(
  "/massive",
  [SchemaValidator(MassiveTransactionSchema)],
  TransactionController.createMassiveTransactions
);

module.exports.TransactionRouter = router;
