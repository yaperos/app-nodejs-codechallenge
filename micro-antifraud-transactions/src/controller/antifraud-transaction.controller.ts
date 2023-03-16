import { consumer, postgres, producer_status } from "@infrastructure/constants";
import { get } from "lodash";
import { TransactionStatus } from "@infrastructure/enums";
import { _logger } from "@infrastructure/utils";
import { TransactionResponse } from "types/transaction_schema";

/**
 * Verify a transaction from microservice {transactions}
 *
 * @return {<Promise<void>>}
 * */
export const verifyTransaction = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topics: [
      `${process.env.KAFKA_TOPIC_TRANSACTION}`,
      `${process.env.KAFKA_TOPIC_TRANSACTION_2}`,
      `${process.env.KAFKA_TOPIC_TRANSACTION_3}`,
    ],
    fromBeginning: false,
  });

  await consumer.run({
    eachBatchAutoResolve: true,
    autoCommit: true,
    autoCommitInterval: 10000,
    eachBatch: async ({ batch, resolveOffset, heartbeat, uncommittedOffsets }) => {
      for (let message of batch.messages) {
        try {
          const transaction = await getTransactionByExternalId(
            message.value!.toString(),
          );

          _logger.info(`${message.value!.toString()}`);

          if (transaction !== undefined) {
            if (transaction.value > 1000) {
              await sendTransactionStatus(
                TransactionStatus.rejected,
                get(transaction, "transactionExternalId"),
              );
              resolveOffset(message.offset);
              uncommittedOffsets();
              await heartbeat();
            } else {
              await sendTransactionStatus(
                TransactionStatus.approved,
                get(transaction, "transactionExternalId"),
              );
              resolveOffset(message.offset);
              uncommittedOffsets();
              await heartbeat();
            }
          } else {
            _logger.error(`maybe i have an error`);
          }
        } catch (err) {
          _logger.error(`${err}`);
        }
      }
    },
  });
};

/**
 * Return a transaction when accountExternalIdDebit is provided
 *
 * @name getTransactionByExternalId
 * @param {string} transactionExternalId
 * @return {Promise<TransactionResponse>}
 * */
export const getTransactionByExternalId = async (
  transactionExternalId: string,
): Promise<TransactionResponse> => {
  await postgres.connect();

  const { rows } = await postgres.query(
    `SELECT * FROM transactions where "transactionExternalId" = $1`,
    [transactionExternalId],
  );

  return rows[0] as TransactionResponse;
};

/**
 * Send a status when a transaction is provided and verified that exists {transactions}
 *
 * @param {string} transactionStatus
 * @param {string} transactionExternalId
 * @return {<Promise<void>>}
 * */
export const sendTransactionStatus = async (
  transactionStatus: string,
  transactionExternalId: string,
) => {
  const transaction: object = {
    transactionStatus,
    transactionExternalId,
  };

  await producer_status.connect();
  await producer_status.send({
    topic: `${process.env.KAFKA_TOPIC_TRANSACTION_STATUS}`,
    messages: [{ value: JSON.stringify(transaction) }],
  });
  await producer_status.disconnect();
};
