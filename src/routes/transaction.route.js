const express = require("express");
const router = express.Router();
const validateTransaction = require("../middlewares/validationTransaction.middleware");
const {
  createTransaction,
  getTransactionById,
  getTransactionFindAll,
} = require("../controllers/transaction.controller");

router.post("/", validateTransaction, createTransaction);

router.get("/:id", getTransactionById);

router.get("/", getTransactionFindAll);

module.exports = router;
