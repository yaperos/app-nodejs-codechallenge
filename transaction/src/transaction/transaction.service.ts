import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProducerService } from 'src/kafka/producer.service';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entity/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly producerService: ProducerService,
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const newTransaction =
      this.transactionRepository.create(createTransactionDto);

    const transactionSaved = await this.transactionRepository.save(
      newTransaction,
    );

    this.producerService.produce({
      topic: 'createTransaction',
      messages: [
        {
          value: JSON.stringify(transactionSaved),
        },
      ],
    });

    return transactionSaved;
  }

  async getTransactions() {
    const transactions = await this.transactionRepository.find({
      select: ['transactionExternalId', 'status', 'value', 'createdAt'],
    });

    return transactions.map((transaction) => ({
      transactionExternalId: transaction.transactionExternalId,
      transactionType: { name: '' },
      status: {
        name: transaction.status,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    }));
  }
}
