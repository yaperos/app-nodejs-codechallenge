import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { TransactionRepository } from "src/domain/repositories/transaction.repository";
import { TransactionInfrastructure } from "../../../src/infrastructure/transaction.infrastructure";
import { GetTransactionByIdDto } from "../dtos/get-transaction-by-id.response.dto";

export class GetTransactionQuery {
  constructor(public readonly transactionExternalId: string) {}
}

@QueryHandler(GetTransactionQuery)
export class GetTransactionQueryHandler implements IQueryHandler<GetTransactionQuery,GetTransactionByIdDto> {
  constructor(
     @Inject(TransactionInfrastructure) private transactionRepository: TransactionRepository
  ) {}
  async execute(query: GetTransactionQuery): Promise<GetTransactionByIdDto> {
     const transaction = await this.transactionRepository.getTransactionById(query.transactionExternalId);
     console.log('transaction', transaction);
     return GetTransactionByIdDto.reponse(transaction);
  }
}