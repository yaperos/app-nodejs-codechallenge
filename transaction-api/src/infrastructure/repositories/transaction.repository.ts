import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransferType } from 'src/domain/models';
import { TransactionRepository } from 'src/domain/repositories';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private repository: Repository<Transaction>,
  ) {}

  async add(model: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: TransferType;
    value: number;
  }) {
    const transaction = this.repository.create(model);
    transaction.transferType = model.tranferTypeId;
    transaction.createdAt = new Date();
    return await this.repository.save(transaction);
  }

  async update(id: string, transaction: Partial<Transaction>) {
    await this.repository.update(id, transaction);
  }

  async getById(id: string) {
    const transaction = await this.repository.findOneBy({
      id,
    });
    return transaction;
  }
}
