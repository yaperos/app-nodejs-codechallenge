import { TransactionRepository } from 'src/repositories/transaction.repository';
import { GetTransactionQuery } from '../impl/get-transaction.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler
  implements IQueryHandler<GetTransactionQuery>
{
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(query: GetTransactionQuery) {
    try {
      const { externalId } = query;

      const transaction =
        await this.transactionRepository.findByExternalId(externalId);

      if (!transaction) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Transaction not found',
        });
      }

      return {
        transactionExternalId: transaction.externalId,
        transactionType: { name: transaction?.typeName },
        transactionStatus: { name: transaction.statusName },
        value: transaction.value,
        createdAt: transaction.createdAt,
      };
    } catch (error) {
      throw new RpcException({
        statusCode:
          error?.error?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
        message: error?.error?.message ?? 'Transaction not found',
      });
    }
  }
}
