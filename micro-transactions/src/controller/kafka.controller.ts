import { consumer } from "@micro/kafka";
import { KafkaTransactionStatusResponse } from "types/kafka_transacion_status_schema";
import {
  _logger,
  TransactionStatus,
  postgres,
  TransactionQueries,
} from "@infrastructure/index";

/**
 * Update a transaction when the microservice antifraud producer send a message
 *
 * @name updateTransaction
 * @return {<Promise<void>>}
 * */
export const updateTransaction = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: `${process.env.KAFKA_TOPIC_TRANSACTION_STATUS}`,
    fromBeginning: false,
  });

  await consumer.run({
    eachBatchAutoResolve: true,
    autoCommit: false,
    autoCommitInterval: 10000,
    eachBatch: async ({ batch, resolveOffset, heartbeat }) => {
      try {
        for (let message of batch.messages) {
          const kakfa_response: KafkaTransactionStatusResponse = JSON.parse(
            message.value!.toString(),
          );

          _logger.info(`${JSON.stringify(kakfa_response)}`);

          if (kakfa_response !== undefined) {
            const approved: boolean =
              kakfa_response.transactionStatus === TransactionStatus.approved;

            await postgres.connect();
            await postgres.query(TransactionQueries.UPDATE, [
              approved ? 2 : 3,
              kakfa_response.transactionExternalId,
            ]);

            resolveOffset(message.offset);
            await heartbeat();
          }

          resolveOffset(message.offset);
          await heartbeat();
        }
      } catch (err) {
        _logger.error(`${err}`);
      }
    },
  });
};
