import express from "express";
import { transactionController } from "./dependencies";

const transactionRouter = express.Router();

transactionRouter.post("/", 
    transactionController.create.bind(transactionController)
);

export { transactionRouter };