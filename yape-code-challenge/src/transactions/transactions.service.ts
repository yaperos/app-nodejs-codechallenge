import { KAFKA_TOPICS } from '@/enums/kafka-topics.enum';
import { ITransactionUpdate } from '@/interfaces/transaction.interface';
import {
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationShutdown,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KafkaService } from '@/kafka/kafka.service';
import { Repository } from 'typeorm';
import { CreateTransactionDTO } from './dtos/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Consumer, Producer } from 'kafkajs';

@Injectable()
export class TransactionsService implements OnApplicationShutdown {
  private readonly logger = new Logger(TransactionsService.name);
  private consumer: Consumer;
  private producer: Producer;

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private kafkaService: KafkaService,
  ) {
    const { consumer, producer } =
      this.kafkaService.initializeProducerAndConsumer('transactions-group');
    this.initializeKafkaConsumerAndProducer(consumer, producer);
  }

  private async initializeKafkaConsumerAndProducer(
    consumer: Consumer,
    producer: Producer,
  ) {
    await consumer.connect();
    await producer.connect();
    this.consumer = consumer;
    this.producer = producer;
    await this.kafkaService.subscribe(
      this.consumer,
      KAFKA_TOPICS.UPDATE_TRANSACTION,
      this.handleTransactionUpdate.bind(this),
    );
    this.logger.log(
      `Consumer and Producer in ${TransactionsService.name} initialized.`,
    );
  }

  /**
   * Handler to validate the new transaction event in kafka
   * @param {ITransactionUpdate} message - Message with the information to update a specific transaction
   */
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
  /**
   * Creates a new transaction
   * @param {CreateTransactionDTO} transactionBody - Body of a new transaction
   * @returns {Transaction} new transaction
   */
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
    this.kafkaService.emit(
      this.producer,
      KAFKA_TOPICS.VALIDATE_TRANSACTION,
      message,
    );

    return transaction;
  }

  /**
   * Finds transaction by externalId
   * @param {String} transactionExternalId - Transaction external id
   * @returns transaction if exists
   */
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

  async onApplicationShutdown() {
    if (this.consumer) {
      await this.consumer.disconnect();
      this.logger.log(`Consumer in ${TransactionsService.name} disconnected.`);
    }
    if (this.producer) {
      await this.producer.disconnect();
      this.logger.log(`Producer in ${TransactionsService.name} disconnected.`);
    }
  }
}
