import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  AntiFraudCreate,
  CreateTransactionDto,
} from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_TRANSACTION_FRAUD } from '../../config/kafka.config';

@Injectable()
export class TransactionService {
  public logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject('KAFKA')
    private readonly kafka: ClientKafka,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const messageValue: AntiFraudCreate = {
      id: createTransactionDto.id,
      amount: createTransactionDto.value,
    };
    try {
      this.kafka.emit(KAFKA_TRANSACTION_FRAUD, messageValue);
    } catch (err) {
      this.logger.error(KAFKA_TRANSACTION_FRAUD, err);
    }

    return this.transactionRepository.save(createTransactionDto);
  }

  findOne(id: string) {
    return this.transactionRepository.findOne({
      where: { id },
    });
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    delete updateTransactionDto.id;
    return this.transactionRepository.update(id, updateTransactionDto);
  }
}
