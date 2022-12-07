import { UpdateTransactionMessage } from "../model/event/update-transaction-message";
import { VerifyTransactionMessage } from "src/anti-fraud/model/event/verify-transaction-message";

export class AntiFraudMapper {

    buildUpdateTransactionMessageFromVerifyTransactionMessage(verifyTransactionMessage: VerifyTransactionMessage, status? : number) : UpdateTransactionMessage {
        const updateTransactionMessage: UpdateTransactionMessage = new UpdateTransactionMessage();
        updateTransactionMessage.id = verifyTransactionMessage.id;
        updateTransactionMessage.amount = verifyTransactionMessage.amount;

        updateTransactionMessage.status = status || 2;

        updateTransactionMessage.type = verifyTransactionMessage.type;
        updateTransactionMessage.createdAt = verifyTransactionMessage.createdAt;
        updateTransactionMessage.accountCreditId = verifyTransactionMessage.accountCreditId;
        updateTransactionMessage.accountDebitId = verifyTransactionMessage.accountDebitId;
        updateTransactionMessage.uuid = verifyTransactionMessage.uuid;

        return updateTransactionMessage;
    }
}