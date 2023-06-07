import { Injectable } from "@nestjs/common";
import { Transaction } from "../domain/transaction.domain";
import { TransactionQueryPort } from "../infraestructure/ports/out/transaction-query.port";
import { TransactionDocument } from "../infraestructure/adapters/out/documents/transaction.document";
import { InjectModel } from "@nestjs/mongoose";
import { Transactions } from "../infraestructure/adapters/out/schemas/transaction.schema";
import { Model } from "mongoose";
import { TransactionDocumentMapper } from "./mappers/transaction-document.mapper";

@Injectable()
export class TransactionQueryUseCase implements TransactionQueryPort{
    constructor(@InjectModel(Transactions.name) private readonly transactionsRepository: Model<TransactionDocument>) {}

    async getTransaction(transaction: Transaction): Promise<Transaction> {
        const document = await this.transactionsRepository.findById(transaction.transactionExternalId);
        return TransactionDocumentMapper.toDomain(document);
    }
}