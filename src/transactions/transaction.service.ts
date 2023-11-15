import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransactionDto } from './dto/transaction.dto';

import { TransactionsEntity } from './entities/transaction.entity';
import { randomUUID } from 'crypto';
import { sendKafkaMessage } from 'src/kafka/kafka.producer';
import { Topics } from 'src/common/types/topicsNames';
import { Event } from 'src/common/types/event.interface';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger('TransactionService');

  constructor(
    @InjectRepository(TransactionsEntity)
    private readonly transactionRepository: Repository<TransactionsEntity>,
  ) {}

  async create(data: CreateTransactionDto) {
    try {
      data.accountExternalIdCredit = randomUUID();
      data.accountExternalIdDebit = randomUUID();
      const transaction = this.transactionRepository.create(data);

      console.log(transaction);
      await sendKafkaMessage(
        Topics.TRANSACTION_CREATED,
        JSON.stringify({
          transactionId: transaction.id,
          value: transaction.value,
          status: transaction.status,
        }),
      );

      await this.transactionRepository.save(transaction);

      return transaction;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string): Promise<TransactionsEntity> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: id },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    return transaction;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  async updateTransactionStatus(event: Event): Promise<void> {
    const { transactionId, status } = event;
    console.log({ transactionId, status });
    const transaction = await this.findOne(transactionId);
    console.log({ transaction });
    transaction.status = status;
    const resp = await this.transactionRepository.save(transaction);
    console.log({ resp });
    return;
  }
}
