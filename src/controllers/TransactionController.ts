import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Transaction } from "../entities/Transaction";
import { publishTransactionCreatedEvent } from "../services/KafkaService";

// Handles creating a new transaction (POST)
export const createTransaction = async (req: Request, res: Response) => {
  const {
    accountExternalIdDebit,
    accountExternalIdCredit,
    tranferTypeId,
    value,
  } = req.body;

  // Basic input validation before touching the DB
  if (
    !accountExternalIdDebit ||
    !accountExternalIdCredit ||
    !tranferTypeId ||
    value === undefined
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const transactionRepository = AppDataSource.getRepository(Transaction);

  try {
    // 1. Prepare the transaction entity before saving
    let newTransaction = transactionRepository.create({
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value: parseFloat(value), // Make sure the value is treated as a number
      transactionStatus: "pending",
    });

    // 2. Persist the transaction in the database
    newTransaction = await transactionRepository.save(newTransaction);

    // 3. Publish event so other services can validate the transaction later
    await publishTransactionCreatedEvent(newTransaction);

    return res.status(201).json({
      message: "Transaction created and pending validation",
      transactionExternalId: newTransaction.transactionExternalId,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Handles retrieving a transaction by ID (GET)
export const getTransactionById = async (req: Request, res: Response) => {
  const { id } = req.params; // ID passed through the route

  if (!id) {
    return res.status(400).json({ message: "Transaction ID is required" });
  }

  const transactionRepository = AppDataSource.getRepository(Transaction);

  try {
    // Look up the transaction using its external ID
    const transaction = await transactionRepository.findOne({
      where: { transactionExternalId: id },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.tranferTypeId,
      },
      transactionStatus: {
        name: transaction.transactionStatus, // pending, approved, rejected
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    });
  } catch (error) {
    console.error("Error retrieving transaction:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
