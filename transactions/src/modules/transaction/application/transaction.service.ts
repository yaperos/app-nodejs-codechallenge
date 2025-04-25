import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { TransactionRepository } from '../infrastructure/transaction.repository';
import { Transaction } from '../domain/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    @Inject('TRANSACTION_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create(createTransactionDto);
    const createdTransaction =
      await this.transactionRepository.save(transaction);

    this.kafkaClient.emit('transaction.created', {
      value: {
        id: createdTransaction.id,
        value: createdTransaction.value,
      },
    });

    return createdTransaction;
  }

  async getTransaction(id: string): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return {
      transactionExternalId: transaction.id,
      createdAt: transaction.createdAt,
      value: transaction.value,
      transactionStatus: {
        name: transaction.status,
      },
      transactionType: {
        name: transaction.transferTypeId,
      },
    };
  }

  async handleTransactionApproved(id: string) {
    console.log('id', id);
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    transaction.status = 'approved';

    await this.transactionRepository.save(transaction);
  }

  async handleTransactionDeclined(id: string) {
    console.log('id', id);
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    transaction.status = 'declined';

    await this.transactionRepository.save(transaction);
  }
}
