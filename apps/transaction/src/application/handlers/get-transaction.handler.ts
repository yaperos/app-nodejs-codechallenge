import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { TransactionTypeId, TransactionTypeName } from "../../domain/enums/transaction-type.enum";
import { TransactionModel } from "../../domain/transaction.model";
import { TransactionRepository } from "../../domain/transaction.repository";
import { GetTransactionOutput } from "../../infraestructure/dto/get-transaction.output";
import { GetTransactionQuery } from "../get-transaction.query";

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler implements IQueryHandler<GetTransactionQuery> {

  constructor(
    @Inject(TransactionRepository) private readonly transactionRepository: TransactionRepository) { }

  async execute(getTransactionQuery: GetTransactionQuery): Promise<GetTransactionOutput> {
    const transaction = await this.transactionRepository.findOne(getTransactionQuery.id);
    if (!transaction) throw new NotFoundException(`No se encontró transacción con ID ${getTransactionQuery.id}`)
    return this.transformTransactionToOutput(transaction);
  }

  private transformTransactionToOutput(transaction: TransactionModel): GetTransactionOutput {
    let transactionName = null;
    switch (transaction.tranferTypeId) {
      case TransactionTypeId.DEBIT:
        transactionName = TransactionTypeName.DEBIT;
      case TransactionTypeId.CREDIT:
        transactionName = TransactionTypeName.CREDIT;
    }

    return {
      transactionExternalId: transaction.id,
      transactionType: {
        name: transactionName,
      },
      transactionStatus: {
        name: transaction.status,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }
}