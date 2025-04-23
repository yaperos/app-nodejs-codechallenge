import { Injectable, Inject, Logger, NotFoundException, InternalServerErrorException, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { TRANSACTION_SERVICE_KAFKA_CLIENT, KAFKA_TOPIC_TRANSACTION_CREATED } from '../../shared/constants';
import { TransactionResponseDto } from '../dto/create-transaction-response.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @Inject(TRANSACTION_SERVICE_KAFKA_CLIENT)
    private readonly kafkaClient: ClientKafka,
  ) { }

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(KAFKA_TOPIC_TRANSACTION_CREATED);

    try {
      await this.kafkaClient.connect();
      this.logger.log('Kafka client connected successfully.');
    } catch (error) {
      this.logger.error('Failed to connect Kafka client:', error);
    }
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
    this.logger.log('Kafka client disconnected.');
  }


  async createTransaction(createDto: CreateTransactionDto): Promise<TransactionResponseDto> {
    this.logger.log(`Creating transaction: ${JSON.stringify(createDto)}`);

    const transaction = this.transactionRepository.create({
      ...createDto,
      transactionExternalId: uuidv4(),
      status: TransactionStatus.PENDING,
    });

    try {
      const savedTransaction = await this.transactionRepository.save(transaction);
      this.logger.log(`Transaction ${savedTransaction.transactionExternalId} saved with PENDING status.`);

      const eventPayload = {
        transactionId: savedTransaction.transactionExternalId,
        value: savedTransaction.value,
      };

      this.kafkaClient.emit(KAFKA_TOPIC_TRANSACTION_CREATED, JSON.stringify(eventPayload));
      this.logger.log(`Event emitted to ${KAFKA_TOPIC_TRANSACTION_CREATED} for transaction ${savedTransaction.transactionExternalId}`);

      return TransactionResponseDto.fromEntity(savedTransaction);

    } catch (error) {
      this.logger.error(`Failed to create transaction or emit event: ${error.message}`, error.stack);
      // Consider more specific error handling (e.g., db constraint errors)
      throw new InternalServerErrorException('Failed to create transaction.');
    }
  }

  async findTransactionById(transactionExternalId: string): Promise<TransactionResponseDto> {
    this.logger.log(`Retrieving transaction by external ID: ${transactionExternalId}`);
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId },
    });

    if (!transaction) {
      this.logger.warn(`Transaction with external ID ${transactionExternalId} not found.`);
      throw new NotFoundException(`Transaction with external ID ${transactionExternalId} not found`);
    }

    this.logger.log(`Found transaction: ${JSON.stringify(transaction)}`);
    return TransactionResponseDto.fromEntity(transaction);
  }

  async updateTransactionStatus(transactionExternalId: string, status: TransactionStatus): Promise<Transaction> {
    this.logger.log(`Attempting to update status for transaction ${transactionExternalId} to ${status}`);
    const transaction = await this.transactionRepository.findOne({ where: { transactionExternalId } });

    if (!transaction) {
      this.logger.error(`Transaction ${transactionExternalId} not found for status update.`);
      throw new NotFoundException(`Transaction ${transactionExternalId} not found for status update.`);
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      this.logger.warn(`Transaction ${transactionExternalId} already has status ${transaction.status}. Ignoring update to ${status}.`);
      return transaction; // Return the existing transaction
    }

    transaction.status = status;

    try {
      const updatedTransaction = await this.transactionRepository.save(transaction);
      this.logger.log(`Transaction ${transactionExternalId} status updated to ${status}.`);
      return updatedTransaction;
    } catch (error) {
      this.logger.error(`Failed to update status for transaction ${transactionExternalId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Failed to update status for transaction ${transactionExternalId}`);
    }
  }
}