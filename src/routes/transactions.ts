import express from "express";
import { createTransaction } from "../controllers/createTransaction";
import { getTransactionById } from "../controllers/getTransactionById";
import { requestValidator } from "../middleware/requestValidator";
import {
  createTransactionSchema,
  getTransactionByIdSchema,
} from "../validation/transactionValidation";

const router = express.Router();

router.post(
  "/transactions",
  requestValidator(createTransactionSchema),
  createTransaction
);
router.get(
  "/transactions/:id",
  requestValidator(getTransactionByIdSchema),
  getTransactionById
);

export default router;
