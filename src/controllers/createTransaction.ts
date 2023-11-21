import { Request, Response, NextFunction } from "express";
import { Transaction } from "../models/transaction";
import { producer } from "../services/kafka";
import { AppDataSource } from "../config/database";
import { logger } from "../config/logger";

interface TransactionRequest {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
}

export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      transferTypeId,
      value,
    } = req.body as TransactionRequest;

    if (
      !accountExternalIdDebit ||
      !accountExternalIdCredit ||
      !transferTypeId ||
      !value
    ) {
      return res
        .status(400)
        .json({ message: "Datos de transacción inválidos" });
    }

    const transactionRepository = AppDataSource.getRepository(Transaction);
    const transaction = new Transaction();
    transaction.accountExternalIdDebit = accountExternalIdDebit;
    transaction.accountExternalIdCredit = accountExternalIdCredit;
    transaction.transferTypeId = transferTypeId;
    transaction.value = value;
    await transactionRepository.save(transaction);

    const kafkaMessage = {
      transactionId: transaction.id,
      accountExternalIdDebit,
      accountExternalIdCredit,
      transferTypeId,
      value,
    };

    await producer.send({
      topic: "send-transaction",
      messages: [{ value: JSON.stringify(kafkaMessage) }],
    });

    res.status(201).json({
      message: `Transacción ${transaction.id} created`,
    });
  } catch (error) {
    logger.error("Error processing transaction:", error);
    const customErrorMessage = new Error("Error processing transaction");

    next(customErrorMessage);
  }
};
