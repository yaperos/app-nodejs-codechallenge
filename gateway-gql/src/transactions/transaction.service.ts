import { Injectable } from '@nestjs/common';
import { TransactionMicroserviceRepository } from './transaction-microservice.repository';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { CaseMapper } from './CaseMapper';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionMicroserviceRepository: TransactionMicroserviceRepository,
  ) {}
  async create(data: CreateTransactionInput) {
    const created = await this.transactionMicroserviceRepository.create(
      CaseMapper.keysToSnakeCase(data),
    );
    return CaseMapper.keysToCamelCase(created);
  }

  async getById(transactionExternalId: string) {
    const transaction = await this.transactionMicroserviceRepository.get(
      transactionExternalId,
    );
    if (transaction) return CaseMapper.keysToCamelCase(transaction);
    else return null;
  }
}
