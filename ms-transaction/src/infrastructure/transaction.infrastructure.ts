import { TransactionRepository } from '../domain/repositories/transaction.repository';
import { Transaction } from '../domain/aggregates/transaction';
import { AppService } from '../app.service';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionDto } from './dtos/transaction.dto';

export class TransactionInfrastructure implements TransactionRepository {
  async save(transaction: Transaction): Promise<Transaction> {
    const transactionEntity = TransactionDto.fromDomainToEntity(transaction);
    const transactionSaved = await AppService.manager
      .getRepository(TransactionEntity)
      .save(transactionEntity);
    const transactionDomain =
      TransactionDto.fromEntityToDomain(transactionSaved);
    console.log(transactionDomain, ' transactin domain');
    return transactionDomain;
  }

  async findById(transactionExternalId: string): Promise<Transaction> {
    const transactionEntity = await AppService.manager
      .getRepository(TransactionEntity)
      .findOne({ where: { transactionExternalId } });

    return TransactionDto.fromEntityToDomain(transactionEntity);
  }
}
