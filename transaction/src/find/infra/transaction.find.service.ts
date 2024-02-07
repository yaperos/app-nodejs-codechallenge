import { TransactionInfraRepository } from 'src/shared/infrastructure/transaction.respository';
import { Injectable } from '@nestjs/common';
import { TransactionFind } from '../app/transaction.find';

@Injectable()
export class TransactionFindService extends TransactionFind {
  constructor(repository: TransactionInfraRepository) {
    super(repository);
  }
}
