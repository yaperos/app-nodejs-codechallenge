import {
  VerifyTransactionConsumerFactory,
  TransactionStatusPublisher,
  TransactionErrorPublisher,
} from "@yape-challenge/kafka";

import {
  EReportedBy,
  ETransactionStatus,
  IRequestVerifyTransaction,
  TTransactionStatus,
} from "./interfaces";
import { ConfigEnv } from "../../config";

class AntiFraudService {
  static async init() {
    await VerifyTransactionConsumerFactory(ConfigEnv.serverTag).subscribe(
      async ({ transactionId, value }: IRequestVerifyTransaction) => {
        try {
          const status = AntiFraudService.verifyTransaction(value);

          await TransactionStatusPublisher.publish({
            transactionId,
            status,
          });
        } catch (error) {
          console.error("[AntiFraudService]", "transactionId", transactionId);
          await AntiFraudService.handleTransactionError(transactionId, error);
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
    if (value > 1000) return ETransactionStatus.REJECTED;
    if (value <= 0) return ETransactionStatus.REJECTED;
    return ETransactionStatus.APPROVED;
  }

  private static async handleTransactionError(
    transactionId: string,
    error: any
  ) {
    try {
      await TransactionErrorPublisher.publish({
        reportedBy: EReportedBy.MS_ANTI_FRAUD,
        transactionId,
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
      });
    } catch (publishError) {
      console.error("Failed to publish transaction error", {
        transactionId,
        error: publishError,
      });
    }
  }
}
export { AntiFraudService };
