import { NextFunction, Request, Response } from "express";
import { v4 as uuidV4 } from "uuid";
import { ZodError } from "zod";
import { BadRequestError } from "../../error";
import { IDatabaseService } from "../../infrastructure";
import {
  ETransactionAntiFraudResponse,
  GetTransactionDTOFromTransactionModel,
  TransactionAntiFraudResponseModel,
  TransactionModel,
  transactionType,
} from "../../transaction";
import { CreateTransactionBodySchema } from "./schemas";
import { ITransactionHandler } from "./transaction.interfaces";

export * from "./transaction.interfaces";

type dependencies = {
  dbService: IDatabaseService;
};

export class TransactionHandler implements ITransactionHandler {
  private readonly _dbService: IDatabaseService;

  constructor({ dbService }: dependencies) {
    this._dbService = dbService;

    this.createTransaction = this.createTransaction.bind(this);
    this.getTransactionById = this.getTransactionById.bind(this);
  }

  async createTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const createTransactionBodyData = CreateTransactionBodySchema.parse(
        req.body
      );

      const {
        accountExternalIdCredit,
        accountExternalIdDebit,
        transferTypeId,
        value,
      } = createTransactionBodyData;

      // TODO: Emit event to validate incoming transaction request

      const transactionAntiFraudRecord =
        new TransactionAntiFraudResponseModel();
      transactionAntiFraudRecord.id = uuidV4();
      transactionAntiFraudRecord.transactionStatus =
        ETransactionAntiFraudResponse.PENDING;

      const transactionRecord = new TransactionModel();
      transactionRecord.id = uuidV4();
      transactionRecord.value = value;
      transactionRecord.accountExternalIdDebit = accountExternalIdDebit;
      transactionRecord.accountExternalIdCredit = accountExternalIdCredit;
      transactionRecord.transferType = transactionType(transferTypeId);
      transactionRecord.antiFraudResponse = transactionAntiFraudRecord;

      transactionAntiFraudRecord.transaction = transactionRecord;

      await this._dbService
        .dataSource()
        .manager.save(transactionAntiFraudRecord);

      await this._dbService.dataSource().manager.save(transactionRecord);

      res.status(201).json({
        transactionId: transactionRecord.id,
      });
      return;
    } catch (error) {
      console.log("error", error);
      if (error instanceof ZodError) {
        next(
          new BadRequestError(
            400,
            error.issues.map((issue) => issue.message)
          )
        );
        return;
      }

      next(error);
      return;
    }
  }

  async getTransactionById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { transactionId: id } = req.params;

      const transactionRepository = this._dbService
        .dataSource()
        .getRepository(TransactionModel);

      const transactionRecord = await transactionRepository.findOne({
        where: {
          id,
        },
        relations: {
          antiFraudResponse: true,
        },
      });

      if (!transactionRecord) {
        res.status(500).send(`No transaction found with id: ${id}`);
        return;
      }

      res
        .status(200)
        .json(
          GetTransactionDTOFromTransactionModel.transform(transactionRecord)
        );
      return;
    } catch (error) {
      next(error);
      return;
    }
  }
}
