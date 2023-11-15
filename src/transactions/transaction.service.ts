import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateTransactionDto } from './dto/transaction.dto';

import { TransactionsEntity } from './entities/transaction.entity';
import { randomUUID } from 'crypto';
import { sendKafkaMessage } from 'src/kafka/kafka.producer';

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

      await this.transactionRepository.save(transaction);
      console.log(transaction);
      await sendKafkaMessage(
        'transaction-created',
        JSON.stringify({
          transactionId: transaction.id,
          value: transaction.value,
          status: transaction.status,
        }),
      );

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

  async antiFraud(event: any): Promise<void> {
    console.log({ event });
    const { transactionId } = event;
    const transaction = await this.findOne(transactionId);
    console.log('++++', transaction);

    if (+transaction.value < 1000) {
      await sendKafkaMessage(
        'approved',
        JSON.stringify({
          transactionId: transaction.id,
          value: transaction.value,
          status: 'approved',
        }),
      );
    } else {
      await sendKafkaMessage(
        'rejected',
        JSON.stringify({
          transactionId: transaction.id,
          value: transaction.value,
          status: 'rejected',
        }),
      );
    }
  }

  async updateTransactionStatus(event: any): Promise<void> {
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
