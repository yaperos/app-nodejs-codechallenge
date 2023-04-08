import express from "express";
import { transactionExternalRouter } from "../routes";

const v1Router = express.Router();

v1Router.get("/", (req, res) => {
  return res.json({ message: "Hello :), we're up" });
});

v1Router.use("/transaction", transactionExternalRouter);

export { v1Router };
