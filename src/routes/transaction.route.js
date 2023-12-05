const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactionById,
  getTransactionFindAll,
} = require("../controllers/transaction.controller");

router.post("/", createTransaction);

router.get("/:id", getTransactionById);

router.get("/", getTransactionFindAll);

module.exports = router;
