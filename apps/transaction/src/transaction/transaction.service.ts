import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionDto } from './dto/get-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject('ANTI-FRAUD-MICROSERVICE')
    private antiFraudMicroservice: ClientKafka,
    @InjectMetric('transactions_saved')
    public transactions_saved_counter: Counter<string>,
    @InjectMetric('transactions_updated')
    public transactions_updated_counter: Counter<string>,
  ) {}

  async create(dto: CreateTransactionDto): Promise<GetTransactionDto> {
    const transaction = new Transaction();
    transaction.accountExternalIdCredit = dto.accountExternalIdCredit;
    transaction.accountExternalIdDebit = dto.accountExternalIdDebit;
    transaction.value = dto.value;

    await this.transactionRepository.save(transaction);
    this.logger.debug('transaction saved');
    this.transactions_saved_counter.inc();

    this.antiFraudMicroservice
      .send('transaction-created', transaction)
      .subscribe((result) => {
        transaction.status = result;
        this.transactionRepository.save(transaction);
        this.logger.debug('transaction updated');
        this.transactions_updated_counter.inc();
      });

    const response = new GetTransactionDto();
    response.id = transaction.id;
    response.status = transaction.status;
    response.value = transaction.value;
    response.createdAt = transaction.createdAt;
    response.updatedAt = transaction.updatedAt;

    return response;
  }

  findAll(): Promise<GetTransactionDto[]> {
    return this.transactionRepository.find().then((transactions) => {
      return transactions.map((t) => {
        const dto = new GetTransactionDto();
        dto.id = t.id;
        dto.status = t.status;
        dto.value = t.value;
        dto.createdAt = t.createdAt;
        dto.updatedAt = t.updatedAt;
        return dto;
      });
    });
  }

  findOne(id: string): Promise<GetTransactionDto> {
    return this.transactionRepository.findOneBy({ id }).then((t) => {
      const dto = new GetTransactionDto();
      dto.id = t.id;
      dto.status = t.status;
      dto.value = t.value;
      dto.createdAt = t.createdAt;
      dto.updatedAt = t.updatedAt;
      return dto;
    });
  }

  async onModuleInit() {
    this.antiFraudMicroservice.subscribeToResponseOf('transaction-created');
  }
}
