import { Request, Response } from "express";
import { logger } from "../../../domain/bootstrap/logger";
import { transactionService } from "../../../domain/bootstrap/services";
import { AccountExternalId } from "../../../domain/entities/value-objects/account-external-id";
import { TransferTypeId } from "../../../domain/entities/value-objects/transfer-type-id";
import { CreateTransactionRequest } from "../../requests/create-transaction-request";
import { TransactionResource } from "../../resources/transaction-resource";

export const CreateTransaction = async (req: Request, res: Response) => {
  try {
    const body: CreateTransactionRequest = req.body;

    logger.log(body);

    const transaction = await transactionService.create(
      new AccountExternalId(body.accountExternalIdDebit),
      new AccountExternalId(body.accountExternalIdCredit),
      new TransferTypeId(body.transferTypeId),
      body.value,
    );

    return res.status(201).json(new TransactionResource(transaction).toJson());
  } catch (error) {
    return res.status(500).json({
      message: "a problem has ocurred",
      error: error,
    });
  }
};
