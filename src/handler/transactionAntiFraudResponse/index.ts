import { KafkaMessage } from "kafkajs";
import {
  ETransactionAntiFraudResponse,
  TransactionAntiFraudResponseModel,
} from "../../transaction";
import { IProcessAntiFraudResponseMessage } from "./interfaces";
import { ITransactionAntiFraudResponseHandler } from "./transactionAntiFraudResponse.interfaces";

export * from "./transactionAntiFraudResponse.interfaces";

export class TransactionAntiFraudResponseHandler
  implements ITransactionAntiFraudResponseHandler
{
  async processAntiFraudResponse({ key, value }: KafkaMessage) {
    try {
      const message: IProcessAntiFraudResponseMessage = {
        key: key?.toString() ?? "",
        value: JSON.parse(value?.toString() ?? ""),
      };

      const transactionAntiFraudExisting =
        await TransactionAntiFraudResponseModel.findOne({
          where: {
            transactionStatus: ETransactionAntiFraudResponse.PENDING,
            transaction: {
              id: message.key,
            },
          },
          select: {
            id: true,
            transactionStatus: true,
          },
        });

      if (!transactionAntiFraudExisting) {
        console.error(
          "TransactionAntiFraudResponse was already processed or no doesn't exist",
          message
        );
        return;
      }

      await transactionAntiFraudExisting?.updateTransactionStatus(
        message.value.transactionStatus,
        message.key
      );

      console.info("processAntiFraudResponse executed successfully", message);
      return;
    } catch (error) {
      console.error(
        "TransactionAntiFraudResponseHandler.processAntiFraudResponse",
        error
      );
      return;
    }
  }
}
