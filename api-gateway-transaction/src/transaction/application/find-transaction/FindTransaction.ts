import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/transaction/domain/TransactionRepository';

@Injectable()
export class FindTransaction {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(id: string) {
    return await this.repository.getById(id);
  }
}
