import {MessageTransactionModel} from "../Models/MessageTransactionModel";
import {MessageStatusModel} from "../Models/MessageStatusModel";
import {VALIDATION_ANTI_FRAUD_STATUS} from "../Constants/CommonConstants";

export class AntiFraudService {
    validate(transaction: MessageTransactionModel): MessageStatusModel {
        if (transaction.value <= 0) {
            return new MessageStatusModel(
                transaction.transactionExternalId,
                VALIDATION_ANTI_FRAUD_STATUS.REJECTED,
                'invalid_value'
            );
        }

        if (transaction.value > 1000) {
            return new MessageStatusModel(
                transaction.transactionExternalId,
                VALIDATION_ANTI_FRAUD_STATUS.REJECTED,
                'value_exceeds_limit'
            );
        }

        return new MessageStatusModel(transaction.transactionExternalId, VALIDATION_ANTI_FRAUD_STATUS.APPROVED);
    }
}
