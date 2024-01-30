import { Inject, Injectable } from "@nestjs/common";
import { TransactionInfrastructure } from "../infrastructure/transaction.infrastructure";
import { TransactionRepository } from "../domain/repositories/transaction.repository";
import { TStatusTransaction, Transaction } from "../domain/transaction";
import { TransactionCreated } from "./dtos/transaction-created.dto";
import { EventPublisher } from "@nestjs/cqrs";

@Injectable()
export class TransactionApplication {
    constructor(@Inject(TransactionInfrastructure) private readonly repository: TransactionRepository, private publisher: EventPublisher) { }

    async save(transaction: Transaction) {
        const transactionSaved = this.publisher.mergeObjectContext(await this.repository.save(transaction))
        transactionSaved.commit()
        return TransactionCreated.fromDomainToResponse(transactionSaved)
    }

    async getByIdDoc(transactionId: string) {
        return await this.repository.getByIdDoc(transactionId)
    }

    async update(transationId: string, status: TStatusTransaction) {
        const transaction = await this.repository.getById(transationId)
        transaction.update(status)
        await this.repository.save(transaction)

        const transactionDoc = await this.repository.getByIdDoc(transationId)
        transactionDoc.transactionStatus = { name: status }
        await this.repository.save_doc(transactionDoc)
    }
}