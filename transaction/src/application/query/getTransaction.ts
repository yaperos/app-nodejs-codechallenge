import { Get, Inject, Query } from "@nestjs/common";
import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { TransactionRepository } from "src/domain/transaction.repository";
import { TransactionInfrastructure } from "src/infrastructure/transaction.infrastructure";
import { TransactionGetDto } from "../dtos/transactionGet.dto";


export class GetTransaction implements IQuery {
    constructor(public readonly trExternalId: string) {}
}

@QueryHandler(GetTransaction)
export class GetTransactionHandler implements IQueryHandler<GetTransaction, TransactionGetDto> {
    constructor(
        @Inject(TransactionInfrastructure)
        private repository: TransactionRepository
    ){}

    async execute(query: GetTransaction): Promise<TransactionGetDto>{
        const opTransaction = await this.repository.findById(query.trExternalId);
        return TransactionGetDto.domainToGetResponse(opTransaction);
    }
}

