import express from "express";
import { createTransaction } from "../controllers/createTransaction";
import { getTransactionById } from "../controllers/getTransactionById";

const router = express.Router();

router.post("/transactions", createTransaction);
router.get("/transactions/:id", getTransactionById);


export default router;
