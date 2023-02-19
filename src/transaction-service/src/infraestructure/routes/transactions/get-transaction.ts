import { Request, Response } from "express";
import { transactionService } from "../../../domain/bootstrap/services";
import { TransactionId } from "../../../domain/entities/value-objects/transaction-id";
import { TransactionResource } from "../../resources/transaction-resource";

export const GetTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await transactionService.getById(
      new TransactionId(req.params.id)
    );

    return res.status(200).json(new TransactionResource(transaction).toJson());
  } catch (error) {
    return res.status(500).json({
      message: "a problem has ocurred",
      error: error,
    });
  }
};
