import {
  TransactionConsumerFactory,
  TransactionStatusPublisher,
  TransactionErrorPublisher,
} from "@yape-challenge/kafka";

import { IRequestVerifyTransaction, TTransactionStatus } from "./interfaces";
import { ConfigEnv } from "../../config";

class AntiFraudService {
  static async init() {
    await TransactionConsumerFactory(ConfigEnv.serverTag).subscribe(
      async ({ transactionId, value }: IRequestVerifyTransaction) => {
        try {
          const status = AntiFraudService.verifyTransaction(value);

          await TransactionStatusPublisher.publish({
            transactionId,
            status,
          });
        } catch (error) {
          console.error("[AntiFraudService]", "transactionId", transactionId);

          await TransactionErrorPublisher.publish({
            transactionId,
            error: {
              message: error.message,
              name: error.name,
              stack: error.stack,
            },
          });
        }
      }
    );
  }

  /**
   * Verify if transaction is approved or rejected,
   * if value is greater than 1000, reject it,
   * if value is less than 0, reject it,
   * otherwise approve it
   * @param value - Transaction value
   */
  private static verifyTransaction(value: number): TTransactionStatus {
    if (value > 1000) return "REJECTED";
    if (value <= 0) return "REJECTED";
    return "APPROVED";
  }
}
export { AntiFraudService };
