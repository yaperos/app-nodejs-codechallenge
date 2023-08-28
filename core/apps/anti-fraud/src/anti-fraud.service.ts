import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'apps/shared/database/entities/transaction.entity';
import StatusEnum from 'apps/shared/database/enums/status.enum';
import { Repository } from 'typeorm';

@Injectable()
export class AntiFraudService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>) {
  }

  async validGreater(body) {
    const transaction = await this.transactionRepository.findOne({ where: {
      id: body.id,
      transactionStatus: StatusEnum.PENDING
    }});
    let statusTransaction = StatusEnum.APPROVED;
    if (transaction.value > 1000) {
      statusTransaction = StatusEnum.REJECTED;
    }
    transaction.transactionStatus = statusTransaction;
    await this.transactionRepository.save(transaction);
  }
}
