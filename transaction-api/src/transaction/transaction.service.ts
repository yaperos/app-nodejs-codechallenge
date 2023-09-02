import { Injectable, OnModuleInit } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createTransactionInput } from './dto/create-transaction.input';
import { TransactionStatus } from 'src/common/commonTypes';
import { TransactionCreatedEvent } from 'src/transactions.event';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly consumerService: ConsumerService,
    private readonly producerService: ProducerService,
  ) {}

  async getTransactions(): Promise<Transaction[]> {
    return await this.transactionRepository.find({ withDeleted: true });
  }

  async createTransaction(
    transaction: createTransactionInput,
  ): Promise<Transaction> {
    const newTransaction = new Transaction();
    newTransaction.accountExternalIdDebit = transaction.accountExternalIdDebit;
    newTransaction.accountExternalIdCredit =
      transaction.accountExternalIdCredit;
    newTransaction.transferType = transaction.transferType;
    newTransaction.value = transaction.value;
    const transactionCreated =
      await this.transactionRepository.save(newTransaction);
    console.log('Sending event, transaction created');
    await this.producerService.produce({
      topic: 'transaction-created',
      messages: [
        {
          value: JSON.stringify(
            new TransactionCreatedEvent(
              transactionCreated.id,
              transactionCreated.transferType,
              transactionCreated.value,
            ),
          ),
        },
      ],
    });
    return await this.transactionRepository.save(newTransaction);
  }

  async handlerTransactionUpdatedStatus(id: string, status: TransactionStatus) {
    const transaction = await this.findTransactionById(id);
    transaction.status = status;
    await this.transactionRepository.save(transaction);
  }

  async findTransactionById(id: string): Promise<Transaction> {
    return await this.transactionRepository.findOne({ where: { id } });
  }

  async deleteTransaction(id: string): Promise<string> {
    const transaction = await this.findTransactionById(id);
    transaction.status = TransactionStatus.REJECTED;
    await this.transactionRepository.save(transaction);
    await this.transactionRepository
      .createQueryBuilder('t')
      .softDelete()
      .where('id = :id', { id })
      .execute();
    return transaction.id;
  }

  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: ['update-transaction'],
      },
      {
        eachMessage: async ({ message }) => {
          console.log(
            'Receiving transaction update event',
            message.value.toString(),
          );
          const transaction = JSON.parse(message.value.toString());
          await this.transactionRepository.update(
            { id: transaction.id },
            { status: transaction.status },
          );
        },
      },
    );
  }
}
