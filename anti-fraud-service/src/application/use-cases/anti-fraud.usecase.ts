import {Transaction} from "../../domain/entitites/Transaction";

export class AntiFraudUseCase {
    validateTransaction(message: Transaction) {
        return message.value <= 1000;
    }
}