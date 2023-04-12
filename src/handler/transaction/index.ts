import dayjs from "dayjs";
import { ZodError } from "zod";
import { IEventService } from "../../infrastructure/event";
import {
  ETransactionAntiFraudResponse,
  GetTransactionDTOFromTransactionModel,
  TransactionModel,
  transactionType,
} from "../../transaction";
import { IGetTransactionResponse } from "../../transaction/app/GetTransactionResponse.interface";
import { EventTopic } from "../../utils";
import {
  CreateTransactionBody,
  IDeadlineTime,
  ITransactionResponse,
} from "./interfaces";
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
    transactionData: CreateTransactionBody
  ): Promise<ITransactionResponse> {
    try {
      const createTransactionBodyData: CreateTransactionBody =
        CreateTransactionBodySchema.parse(transactionData);

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
          throw Error(
            "Duplicated transaction: you cannot create a new transaction with the same data until the previous one is completed"
          );
        }

        const transactionDeadlineTime = dayjs(transactionExisting.createAt).add(
          DEADLINE_TIME.value,
          DEADLINE_TIME.unit
        );
        const timeDifference = transactionDeadlineTime.diff();
        if (timeDifference >= 0) {
          throw Error(
            `Duplicated transaction: you will be available to execute this request in ${
              timeDifference / 1000
            }seconds`
          );
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
        topic: EventTopic.antiFraudEvalTransaction,
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

      return {
        id,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw Error(
          `Validation error: ${JSON.stringify(
            error.issues.map((issue) => issue.message)
          )}
          `
        );
      }
      throw error;
    }
  }

  async getTransactionById(id: string): Promise<IGetTransactionResponse> {
    try {
      const transactionRecord = await TransactionModel.findById(id, {
        relations: {
          antiFraudResponse: true,
        },
      });

      if (!transactionRecord) {
        const errorMessage = `No transaction found with id: ${id}`;
        console.error(errorMessage);
        throw Error(errorMessage);
      }

      return GetTransactionDTOFromTransactionModel.transform(transactionRecord);
    } catch (error) {
      console.error("TransactionHandler.getTransactionById", error);
      throw error;
    }
  }
}
