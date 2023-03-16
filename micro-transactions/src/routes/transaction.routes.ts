import { getTransaction, saveTransaction } from "@controller/index";
import { Router } from "express";

export const router = Router();

router.post("/transaction", saveTransaction);
router.get("/transaction/:id", getTransaction);
