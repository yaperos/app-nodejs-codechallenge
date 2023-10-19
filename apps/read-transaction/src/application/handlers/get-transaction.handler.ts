import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { TransactionTypeId, TransactionTypeName } from "../../domain/enums/transaction-type.enum";
import { TransactionModel } from "../../domain/models/transaction.model";
import { TransactionMongooseRepository, TransactionRepository } from "../../domain/repositories/transaction.repository";
import { GetTransactionDto } from "../../infraestructure/dto/get-transaction.dto";
import { GetTransactionQuery } from "../queries/get-transaction.query";

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler implements IQueryHandler<GetTransactionQuery> {

  constructor(
    @Inject(TransactionMongooseRepository) private readonly transactionMongooseRepo: TransactionRepository) { }

  async execute(getTransactionQuery: GetTransactionQuery): Promise<GetTransactionDto> {
    const transaction = await this.transactionMongooseRepo.findOne(getTransactionQuery.id);
    if (!transaction) throw new NotFoundException(`No se encontró transacción con ID ${getTransactionQuery.id}`)
    return this.transformTransactionToOutput(transaction);
  }

  private transformTransactionToOutput(transaction: TransactionModel): GetTransactionDto {
    let transactionName = null;
    switch (transaction.transferTypeId) {
      case TransactionTypeId.DEBIT:
        transactionName = TransactionTypeName.DEBIT;
        break;
      case TransactionTypeId.CREDIT:
        transactionName = TransactionTypeName.CREDIT;
        break;
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