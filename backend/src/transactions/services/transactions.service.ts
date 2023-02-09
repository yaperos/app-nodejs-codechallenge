import { Inject, Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from '../dtos/transaction.dto';
import { Transaction, TransactionStatus } from '../entities/transaction.entity';

@Injectable()
export class TransactionsService implements OnModuleInit{
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @Inject('ANTIFRAUD_SERVICE') private readonly client: ClientKafka,
    @InjectRepository(Transaction)
    private repository: Repository<Transaction>
  ) {}

  onModuleInit() {
    this.client.subscribeToResponseOf('transaction');
  }

  async findOne(id: string) {
    const transaction = await this.repository.findOneBy({ id });

    if (!transaction) {
      throw new NotFoundException(`Not found.`);      
    }

    return this.serialize(transaction);
  }

  async create(body: CreateTransactionDto) {
    const transaction = await this.repository.save(body);

    this.validateAntiFraud(transaction);

    return this.serialize(transaction);
  }
  
  async updateStatus(id: string, status: TransactionStatus) {
    return this.repository.update({ id }, { status });
  }

  // TODO: serialize data
  private serialize(transaction) {
    return {
      transactionExternalId: transaction.id,
      transactionType: {
        name: transaction.tranferTypeId
      },
      transactionStatus: {
        name: transaction.status
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }

  private validateAntiFraud(data: CreateTransactionDto) {
    this.client
      .send('transaction', JSON.stringify(data))
      .subscribe((response) => {
        this.logger.log(`validateAntiFraud-> ${JSON.stringify(response)}`);

        this.updateStatus(response.id, response.status);
      })
  }
}
