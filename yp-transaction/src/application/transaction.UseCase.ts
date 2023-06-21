import TransactionEntity, { TransactionStates } from "../domain/transaction.entity";
import { ITransactionRepository } from "../domain/transaction.repository";
import { EventMessages } from "../domain/event.entity";
import { IEventService } from "../domain/event.service";
import { TransactionValue } from "../domain/transaction.value";

export default class TransactionUseCase {
    constructor(private readonly transactionRepo: ITransactionRepository,
        private readonly eventService: IEventService){

    }

    createTransaction = async(transaction: TransactionEntity) => {
        transaction.status = TransactionStates.TRANSACTION_PENDING;

        const transactionValue = new TransactionValue(transaction);
        const createTransaction = await this.transactionRepo.createTransaction(transactionValue);
        if (createTransaction !== null) {
            await this.eventService.addEvent(EventMessages.TRANSACTION_CREATED,{
                accountExternalIdCredit: createTransaction.accountExternalIdCredit,
                accountExternalIdDebit: createTransaction.accountExternalIdDebit,
                transactionExternalId: createTransaction.transactionExternalId!,
                value: createTransaction.value
            })
        }
        
        return createTransaction;
    }

    findTransactionById = async(id: string) => {
        const transaction = await this.transactionRepo.findTransactionById(id);
        return transaction;
    }
}