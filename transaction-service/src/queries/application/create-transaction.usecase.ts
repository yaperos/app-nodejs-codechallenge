import { Inject, Injectable } from "@nestjs/common";
import { Transaction } from "../domain/transaction.domain";
import { CreateTransactionPort } from "../infraestructure/ports/in/create-transaction.port";
import { TypeOrmRespositoryAdapter } from "../infraestructure/adapters/out/typeorm-repository.adapter";
import { EntityRepositoryPort } from "../infraestructure/ports/out/entity-repository.port";
import { TransactionDocument } from "../infraestructure/adapters/out/documents/transaction.document";
import { TransactionDocumentMapper } from "./mappers/transaction-document.mapper";
import { InjectModel } from "@nestjs/mongoose";
import { Transactions } from "../infraestructure/adapters/out/schemas/transaction.schema";
import { Model } from "mongoose";

@Injectable()
export class CreateTransactionUseCase implements CreateTransactionPort {
    constructor(@InjectModel(Transactions.name) private readonly transactionsRepository: Model<TransactionDocument>) {}
    
    async createTransaction(transaction: Transaction) {
        let document = TransactionDocumentMapper.toDocument(transaction);
        if (transaction.action == 'c') {
            document = await this.transactionsRepository.create(document);
        } else {
            const filter = { "_id": transaction.transactionExternalId};
            const update = { "status": transaction.status };
            document = await this.transactionsRepository.findOneAndUpdate(filter, update);
        }
    }    
}