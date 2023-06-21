import { ITransactionRepository } from "../../../domain/transaction.repository";
import { IEventService } from "../../../domain/event.service";
import { EventMessages } from "../../../domain/event.entity";
import TransactionEntity from "../../../domain/transaction.entity";
import DateUtil from "../../../libs/date"
import eventEntity from "../../../domain/event.entity";

export class TransactionRepositoryMock implements ITransactionRepository {
    private transaction: Map<string,TransactionEntity> = new Map();

    async createTransaction(transaction: TransactionEntity): Promise<TransactionEntity | null> {
        this.transaction.set(transaction.transactionExternalId!,transaction);
        return transaction
    }
    async findTransactionById(transactionExternalId: string): Promise<TransactionEntity | null> {
        const tr = this.transaction.get(transactionExternalId);
        return tr === undefined ? null : tr;
    }
    async updateTransactionStatus(transactionExternalId: string, status: number): Promise<TransactionEntity | null> {
        let tr = this.transaction.get(transactionExternalId);

        if (tr === undefined) {
            return null;
        }

        const now = DateUtil.getCurrentDate()
        tr.status = status;
        tr.updatedAt = now.dateTime;
        tr.updatedAtTimestamp = now.timestamp;

        this.transaction.set(transactionExternalId,tr);
        return tr;
    }
}

export class EventServiceMock implements IEventService {
    async addEvent(topic: string, transaction: eventEntity): Promise<any> {
        console.log(topic)
        console.log(transaction)

        if (EventMessages.isEventMessage(topic)) {
            return Error("Not valid message")
        }

        return null
    }
}