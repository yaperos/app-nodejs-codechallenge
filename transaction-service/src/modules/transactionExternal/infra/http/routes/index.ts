import express from "express";
import { createTransactionExternalController } from "../../../useCases/createTransactionExternal";
import { getTransactionExternalController } from "../../../useCases/getTransactionExternal";

const transactionExternalRouter = express.Router();

transactionExternalRouter.post("/", (req, res) =>
  createTransactionExternalController.execute(req, res)
);

transactionExternalRouter.get("/:id", (req, res) =>
  getTransactionExternalController.execute(req, res)
);

export { transactionExternalRouter };
