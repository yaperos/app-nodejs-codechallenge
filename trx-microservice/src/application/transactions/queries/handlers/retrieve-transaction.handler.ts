import { IQueryHandler, IQueryResult, QueryHandler } from "@nestjs/cqrs";
import { RetrieveTransactionQuery } from "../retrieve-transaction.query";
import { TransactionDto } from "../../dto/transaction.dto";
import { TransactionRepository } from "src/domain/transactions/transaction.repository";
import { Inject, Injectable } from "@nestjs/common";

export class RetrieveTransactionResult implements IQueryResult {
    constructor(public readonly transaction: TransactionDto){}
}

@QueryHandler(RetrieveTransactionQuery)
@Injectable()
export class RetrieveTransactionHandler implements IQueryHandler<RetrieveTransactionQuery, RetrieveTransactionResult> {
    constructor(
        @Inject(TransactionRepository)
        private readonly trxRepo: TransactionRepository
    ){}

    async execute(query: RetrieveTransactionQuery): Promise<RetrieveTransactionResult> {
        const trx = await this.trxRepo.findById(query.transactionExternalId);
        if (!trx) throw new Error('Transaction not found')

        const dto = TransactionDto.fromDomain({
            transactionExternalId: trx.transactionExternalId,
            value: trx.value,
            createdAt: trx.createdAt,
            transactionStatus: trx.transactionStatus,
            transactionType: trx.transactionType
        })
        return new RetrieveTransactionResult(dto)
    }
    
}