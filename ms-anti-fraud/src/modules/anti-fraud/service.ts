import {
  TransactionConsumerFactory,
  TransactionStatusPublisher,
} from "@yape-challenge/kafka";

import { IRequestVerifyTransaction, TTransactionStatus } from "./interfaces";
import { ConfigEnv } from "../../config";

class AntiFraudService {
  static async init() {
    await TransactionConsumerFactory(ConfigEnv.serverTag).subscribe(
      async (message: IRequestVerifyTransaction) => {
        const { transactionId, value } = message;
        const status = AntiFraudService.verifyTransaction(value);

        try {
          await TransactionStatusPublisher.publish({
            transactionId,
            status,
          });
        } catch (error) {
          console.error("transactionId", transactionId, "value", value, error);
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
