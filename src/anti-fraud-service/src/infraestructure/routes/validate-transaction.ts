import { logger } from "../../domain/bootstrap/logger";
import { transactionValidatorService } from "../../domain/bootstrap/services";
import { TransactionAmount } from "../../domain/entities/value-objects/transaction-amount";
import { TransactionId } from "../../domain/entities/value-objects/transaction-id";
import { ValidationResource } from "../resources/validation-resource";

export const ValidateTransaction = async (
  consumerMessage: any,
  producer: any
) => {
  try {
    const event = JSON.parse(consumerMessage.value.toString());
    logger.log(event);

    const id = new TransactionId(event.transactionId);
    const amount = new TransactionAmount(event.amount);
    const status = transactionValidatorService.validate(amount);

    await producer.connect();
    await producer.send({
      topic: "transaction-processed",
      messages: [
        {
          value: JSON.stringify(
            new ValidationResource({
              transactionId: id,
              amount,
              status,
            }).toJson()
          ),
        },
      ],
    });
    await producer.disconnect();
  } catch (error) {
    logger.error(error);
  }
};
