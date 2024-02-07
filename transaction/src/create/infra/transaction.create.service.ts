import { Injectable } from '@nestjs/common';
import { TransactionCreate } from '../app/transaction.create';
import { TransactionInfraRepository } from '../../shared/infrastructure/transaction.respository';
import { TransactionCreateProducerKafka } from './transaction.create.producer';

@Injectable()
export class TransactionCreateService extends TransactionCreate {
  constructor(
    repository: TransactionInfraRepository,
    broker: TransactionCreateProducerKafka,
  ) {
    super(repository, broker);
  }
}
