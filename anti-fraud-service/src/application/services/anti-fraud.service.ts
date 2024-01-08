import {Transaction} from "../../domain/entitites/Transaction";

export class AntiFraudService {
    validateTransaction(message: Transaction) {
        return message.value <= 1000;
    }
}