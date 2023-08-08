import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransactionStatusDto } from '../dto';
import { TransactionStatus } from '../models';

@Injectable()
export class TransactionStatusService {
  constructor(
    @InjectRepository(TransactionStatus)
    private readonly transactionStatusRepository: Repository<TransactionStatus>,
  ) {}
  async save(data: CreateTransactionStatusDto) {
    console.log(' service creating transactionStatusTransactionStatus');

    const transactionStatusTransactionStatus: TransactionStatus =
      await this.transactionStatusRepository.create(data);
    return this.transactionStatusRepository.save(
      transactionStatusTransactionStatus,
    );
  }
  async findAll(): Promise<TransactionStatus[]> {
    return await this.transactionStatusRepository.find();
  }

  findOne(id: number): Promise<TransactionStatus> {
    return this.transactionStatusRepository.findOneOrFail({
      where: { id },
    });
  }
}
