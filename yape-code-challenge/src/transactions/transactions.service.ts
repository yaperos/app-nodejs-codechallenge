import { KAFKA_TOPICS } from '@/enums/kafka-topics.enum';
import { ITransactionUpdate } from '@/interfaces/transaction.interface';
import {
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationShutdown,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KafkaService } from 'src/kafka/kafka.service';
import { Repository } from 'typeorm';
import { CreateTransactionDTO } from './dtos/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Consumer } from 'kafkajs';

@Injectable()
export class TransactionsService implements OnApplicationShutdown {
  private readonly logger = new Logger(TransactionsService.name);
  private consumer: Consumer;

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private kafkaService: KafkaService,
  ) {
    this.consumer = this.kafkaService.createConsumer('transactions-group');
    this.logger.log(`Consumer in ${TransactionsService.name} initialized.`);
    this.initializeKafkaConsumer();
  }

  private async initializeKafkaConsumer() {
    await this.kafkaService.subscribe(
      this.consumer,
      KAFKA_TOPICS.UPDATE_TRANSACTION,
      this.handleTransactionUpdate.bind(this),
    );
  }

  async onApplicationShutdown() {
    if (this.consumer) {
      await this.consumer.disconnect();
      this.logger.log(`Consumer in ${TransactionsService.name} disconnected.`);
    }
  }

  private async handleTransactionUpdate(
    message: ITransactionUpdate,
  ): Promise<void> {
    const { transactionExternalId, status } = message;
    await this.transactionRepository.update(transactionExternalId, {
      status: status,
    });
    this.logger.log(
      `Transaction ${transactionExternalId} updated to ${status}.`,
    );
  }

  async createTransaction(
    transactionBody: CreateTransactionDTO,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...transactionBody,
    });
    await this.transactionRepository.save(transaction);
    const message = {
      ...transactionBody,
      transactionExternalId: transaction.transactionExternalId,
    };
    this.logger.log(
      `Transaction created with id ${transaction.transactionExternalId}`,
    );
    this.kafkaService.emit(KAFKA_TOPICS.VALIDATE_TRANSACTION, message);

    return transaction;
  }

  async findOne(transactionExternalId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId },
    });
    if (!transaction) {
      this.logger.error(`Transaction not found (ID=${transactionExternalId}).`);
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }
}
