import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionStatus } from '../entities/transactionStatus.entity';
import { TrasactionStatusInput } from '../dto/create-transaction.input';

@Injectable()
export class TransactionStatusService {
  constructor(
    @InjectRepository(TransactionStatus)
    private readonly transactionStatusRepository: Repository<TransactionStatus>,
  ) {}

  async create(data: TrasactionStatusInput) {
    const transaction = this.transactionStatusRepository.create(data);
    return await this.transactionStatusRepository.save(transaction);
  }

  async findAll() {
    return await this.transactionStatusRepository.find();
  }

  async findByName(name: string) {
    return await this.transactionStatusRepository.findOne({
      where: { name },
    });
  }
}
