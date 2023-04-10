import dayjs from "dayjs";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { BadRequestError } from "../../error";
import { IEventService } from "../../infrastructure/event";
import {
  ETransactionAntiFraudResponse,
  GetTransactionDTOFromTransactionModel,
  TransactionModel,
  transactionType,
} from "../../transaction";
import { CreateTransactionBody, IDeadlineTime } from "./interfaces";
import { CreateTransactionBodySchema } from "./schemas";
import { ITransactionHandler } from "./transaction.interfaces";

export * from "./transaction.interfaces";

type dependencies = {
  eventService: IEventService;
};

const DEADLINE_TIME: IDeadlineTime = {
  value: 30,
  unit: "second",
};

export class TransactionHandler implements ITransactionHandler {
  private readonly _eventService: IEventService;

  constructor({ eventService }: dependencies) {
    this._eventService = eventService;

    this.createTransaction = this.createTransaction.bind(this);
    this.getTransactionById = this.getTransactionById.bind(this);
  }

  async createTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const createTransactionBodyData: CreateTransactionBody =
        CreateTransactionBodySchema.parse(req.body);

      const transactionExisting = await TransactionModel.findOne({
        where: {
          accountExternalIdCredit:
            createTransactionBodyData.accountExternalIdCredit,
          accountExternalIdDebit:
            createTransactionBodyData.accountExternalIdDebit,
          value: createTransactionBodyData.value,
          transferType: transactionType(
            createTransactionBodyData.transferTypeId
          ),
        },
        relations: {
          antiFraudResponse: true,
        },
        order: {
          createAt: "DESC",
        },
      });

      if (transactionExisting) {
        if (
          transactionExisting.antiFraudResponse.transactionStatus ===
          ETransactionAntiFraudResponse.PENDING
        ) {
          res
            .status(400)
            .send(
              "Duplicated transaction: you cannot create a new transaction with the same data until the previous one is completed"
            );
          return;
        }

        const transactionDeadlineTime = dayjs(transactionExisting.createAt).add(
          DEADLINE_TIME.value,
          DEADLINE_TIME.unit
        );
        const timeDifference = transactionDeadlineTime.diff();
        if (timeDifference >= 0) {
          res
            .status(400)
            .send(
              `Duplicated transaction: you will be available to execute this request in ${
                timeDifference / 1000
              }seconds`
            );
          return;
        }
      }

      const {
        id,
        accountExternalIdCredit,
        accountExternalIdDebit,
        transferType,
        value,
      } = await TransactionModel.saveOne({
        ...createTransactionBodyData,
      });

      await this._eventService.sendEvent({
        topic: "anti_fraud_eval_transaction",
        messages: [
          {
            key: id,
            value: JSON.stringify({
              accountExternalIdCredit,
              accountExternalIdDebit,
              transferType,
              value,
            }),
          },
        ],
      });

      res.status(201).json({
        transactionId: id,
      });
      return;
    } catch (error) {
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

      const transactionRecord = await TransactionModel.findOne({
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
