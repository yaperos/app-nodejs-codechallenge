import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject('ANTI-FRAUD-MICROSERVICE')
    private antiFraudMicroservice: ClientKafka,
  ) {}

  async create(dto: CreateTransactionDto) {
    const transaction = new Transaction();
    transaction.accountExternalIdCredit = dto.accountExternalIdCredit;
    transaction.accountExternalIdDebit = dto.accountExternalIdDebit;
    transaction.value = dto.value;

    await this.transactionRepository.save(transaction);
    this.logger.debug('transaction saved');

    this.antiFraudMicroservice
      .send('transaction-created', transaction)
      .subscribe((result) => {
        transaction.status = result;
        this.transactionRepository.save(transaction);
        this.logger.debug('transaction updated');
      });

    return transaction;
  }

  async onModuleInit() {
    this.antiFraudMicroservice.subscribeToResponseOf('transaction-created');
  }
}
