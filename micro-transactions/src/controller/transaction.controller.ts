import { Request, Response } from "express";
import {
  Messages,
  postgres,
  TransactionQueries,
  TransactionType,
} from "@infrastructure/index";
import { TransactionResponse } from "types/transaction_schema";
import { v4 } from "uuid";
import { producer } from "@micro/kafka";
import { TransactionRetrieveResponse } from "types/transacion_retrieve_schema";
import { transaction_status_recipe } from "@infrastructure/constants/recipe";

/**
 * Create a transaction when a user request to the server
 *
 * @name saveTransaction
 * @param {Request} req
 * @param {Response} res
 * */
export const saveTransaction = async (req: Request, res: Response) => {
  const { value }: TransactionResponse = req.body;
  const { is_credit } = req.body;
  const accountExternalIdDebit: string = v4().toString();
  const accountExternalIdCredit: string = v4().toString();
  const transactionExternalId: string = v4().toString();

  try {
    await postgres.connect();
    await postgres.query(TransactionQueries.INSERT, [
      is_credit ? null : accountExternalIdDebit,
      is_credit ? accountExternalIdCredit : null,
      1,
      new Date(),
      value,
      transactionExternalId,
    ]);

    await producer.connect();

    await producer.send({
      topic: `${process.env.KAFKA_TOPIC_TRANSACTION}`,
      messages: [{ value: transactionExternalId }],
    });

    return res.status(200).json({
      message: Messages.CREATED,
      transactionExternalId,
    });
  } catch (e) {
    return res.status(400).json({ message: e });
  }
};

/**
 * Return a transaction when a user request to the server
 *
 * @name getTransaction
 * @param {Request} req
 * @param {Response} res
 * */
export const getTransaction = async (req: Request, res: Response) => {
  const transaction = await getTransactionByExternalId(req.params.id);

  if (transaction === undefined)
    return res.status(400).json({
      message: Messages.NOT_FOUND,
    });

  return res.status(200).json({
    transaction: { ...transaction },
  });
};

/**
 * Return a transaction when transactionExternalId is provided
 *
 * @name getTransactionByExternalId
 * @param {string} transactionExternalId
 * @return {Promise<TransactionResponse>}
 * */
export const getTransactionByExternalId = async (
  transactionExternalId: string,
): Promise<TransactionRetrieveResponse | undefined> => {
  await postgres.connect();

  const { rows } = await postgres.query(TransactionQueries.SELECT, [
    transactionExternalId,
  ]);

  const transaction = rows[0] as TransactionResponse;

  if (transaction === undefined) return undefined;

  return {
    transactionExternalId: transaction.transactionExternalId,
    transactionStatus: {
      name: transaction_status_recipe[transaction.tranferTypeId],
    },
    transactionType: {
      name:
        transaction.accountExternalIdDebit === null
          ? TransactionType.CREDIT
          : TransactionType.DEBIT,
    },
    createdAt: transaction.createdAt,
    value: transaction.value,
  };
};
