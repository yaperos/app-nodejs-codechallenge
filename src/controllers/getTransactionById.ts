import { Request, Response, NextFunction } from "express";
import { Transaction } from "../models/transaction";
import { AppDataSource } from "../config/database";
import { logger } from "../config/logger";
import { ErrorResponse } from "../middleware/errorHandler";

export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const customErrorMessage = new ErrorResponse(
      "Error retrieving transaction",
      500
    );
    next(customErrorMessage);
  }
};
