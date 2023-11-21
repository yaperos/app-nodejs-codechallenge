import { Request, Response, NextFunction } from "express";
import { Transaction } from "../models/transaction";
import { AppDataSource } from "../config/database";
import { logger } from "../config/logger";

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.id;
    const transactionRepository = AppDataSource.getRepository(Transaction);

    const transaction = await transactionRepository.findOneBy({
      id: transactionId,
    });
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    logger.error("Error retrieving transaction:", error);
    res.status(500).json({ message: "Error retrieving transaction" });
  }
};
