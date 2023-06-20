import { TransactionStates } from "../domain/transaction.entity";
import { ITransactionRepository } from "../domain/transaction.repository";
import { EventMessages } from "../domain/event.entity";

export default class EventUseCase {
    constructor(private readonly transactionRepo: ITransactionRepository){
        
    }

    updateTransaction = async(id: string, message: string) => {
        if (message != EventMessages.TRANSACTION_APPROVED && message != EventMessages.TRANSACTION_REJECTED) {
            return null
        }

        const status = message == EventMessages.TRANSACTION_APPROVED 
            ? TransactionStates.TRANSACTION_APPROVED 
            : TransactionStates.TRANSACTION_REJECTED;
        const transaction = await this.transactionRepo.updateTransactionStatus(id, status);

        return transaction;
    }
}