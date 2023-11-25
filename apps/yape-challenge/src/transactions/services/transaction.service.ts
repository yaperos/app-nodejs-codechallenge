import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransaccionEntity } from '../entities';
import { TransaccionDto } from '../dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransaccionEntity)
    private transactionRepository: Repository<TransaccionEntity>,
  ) {}

  async getAllTransactions(): Promise<TransaccionEntity[]> {
    return this.transactionRepository.find();
  }
  async getTransaction(transactionId: string): Promise<TransaccionEntity> {
    return this.transactionRepository.findOne({ where: { transactionId } });
  }

  newTransaction(body: TransaccionDto) {
    const newTransaction = this.transactionRepository.create(body);

    return this.transactionRepository.save(newTransaction);
  }

  async updateStatusTransaction(transactionId: string, body: any) {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionId: transactionId },
    });
    this.transactionRepository.merge(transaction, body);
    return this.transactionRepository.save(transaction);
  }
}
