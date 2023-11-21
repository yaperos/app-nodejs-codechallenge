import express from "express";
import { createTransaction } from "../controllers/createTransaction";

const router = express.Router();

router.post("/transactions", createTransaction);

export default router;
