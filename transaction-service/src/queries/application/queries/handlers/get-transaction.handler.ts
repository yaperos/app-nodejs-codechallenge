import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTransactionQuery } from "../impl/get-transaction.query";
import { Inject } from "@nestjs/common";
import { TransactionQueryUseCase } from "../../transaction-query.usecase";
import { TransactionQueryPort } from "src/queries/infraestructure/ports/out/transaction-query.port";
import { Transaction } from "src/queries/domain/transaction.domain";

@QueryHandler(GetTransactionQuery)
export class GetTransactionsHandler implements IQueryHandler<GetTransactionQuery> {
  constructor(@Inject(TransactionQueryUseCase) private readonly transactionQueryPort: TransactionQueryPort) {}

  async execute(query: GetTransactionQuery): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.transactionExternalId = query.transactionExternalId;
    return this.transactionQueryPort.getTransaction(transaction);
  }
}