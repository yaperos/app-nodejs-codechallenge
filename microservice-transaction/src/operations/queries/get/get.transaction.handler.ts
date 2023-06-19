import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionQuery } from './get.transaction.query';
import { Transaction } from 'src/entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(GetTransactionQuery)
export class GetTransactionQueryHandler
  implements IQueryHandler<GetTransactionQuery, Transaction>
{
  constructor(
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
  ) {}
  async execute(query: GetTransactionQuery): Promise<Transaction> {
    const transactionExternalId = query.transactionExternalId;
    const transaction = await this.transactionRepository.findOne({ where: { transactionExternalId } });
    return transaction;
  }
}
