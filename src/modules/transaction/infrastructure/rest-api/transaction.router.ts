import express from "express";
import { TransactionController } from "./transaction.controller";
import { transactionUsecase } from "../dependencies";

const transactionRouter = express.Router();
const transactionController = new TransactionController(transactionUsecase);

transactionRouter.post("/", 
    transactionController.create.bind(transactionController)
);

export { transactionRouter };