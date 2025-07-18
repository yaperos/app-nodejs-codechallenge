import { Injectable, InternalServerErrorException, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigType } from '@nestjs/config';
import { Transaction } from '../transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { ITransactionCreator } from '../interfaces/transaction-creator.interface';
import { ApplicationPropertiesService } from '../../config/application-properties.service';
import { ReactiveKafkaProducer } from '../../kafka/kafka-producer.service';
import { RawTransaction } from '../../kafka/model/raw-transaction.model';
import { kafkaConfig } from '../../config/kafka.config';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionCreatorService implements ITransactionCreator {
  private readonly logger = new Logger(TransactionCreatorService.name);

  constructor(
    @InjectRepository(Transaction) private repo: Repository<Transaction>,
    private readonly applicationProperties: ApplicationPropertiesService,
    private readonly kafkaProducer: ReactiveKafkaProducer,
    @Inject(kafkaConfig.KEY)
    private readonly kafkaConfiguration: ConfigType<typeof kafkaConfig>,
  ) {}

  async createTrx(request: CreateTransactionDto): Promise<TransactionResponseDto> {
    try {
      // Step 1: Build transaction entity
      const transactionEntity = this.buildTransactionEntity(request);
      
      // Step 2: Save transaction
      const savedEntity = await this.saveTransaction(transactionEntity);
      
      // Step 3: Send message to Kafka (equivalent to sendMessage().then())
      await this.sendMessage(savedEntity);
      
      // Step 4: Build response
      return this.buildTransactionResponse(savedEntity);
      
    } catch (error) {
      this.logger.error('Error creating transaction', error);
      throw new InternalServerErrorException('Failed to create transaction');
    }
  }

  private buildTransactionEntity(request: CreateTransactionDto): Transaction {
    const transaction = new Transaction();
    transaction.id = uuidv4();
    transaction.accountExternalIdDebit = request.accountExternalIdDebit;
    transaction.accountExternalIdCredit = request.accountExternalIdCredit;
    transaction.transactionTypeCode = request.transactionTypeCode;
    transaction.amount = request.amount;
    // Usar applicationProperties para obtener el estado pendiente
    transaction.status = this.applicationProperties.getTrxStatuses().pending;
    transaction.createdAt = new Date();
    transaction.updatedAt = new Date();
    
    return transaction;
  }

  private async saveTransaction(transactionEntity: Transaction): Promise<Transaction> {
    try {
      return await this.repo.save(transactionEntity);
    } catch (error) {
      this.logger.error('Error saving transaction', error);
      throw new InternalServerErrorException('Database error while saving transaction');
    }
  }

  private buildTransactionResponse(entity: Transaction): TransactionResponseDto {
    return new TransactionResponseDto(entity.id);
  }

  /**
   * Send message to Kafka - equivalent to sendMessage() in Java
   */
  private async sendMessage(entity: Transaction): Promise<void> {
    try {
      const trxJson = this.convertTransactionToJson(entity);
      const topic = this.kafkaConfiguration.producer.topic;
      const key = uuidv4();
      
      await firstValueFrom(
        this.kafkaProducer.sendMessage(topic, key, trxJson)
      );
      
      this.logger.log(`📤 Transaction message sent to Kafka: ${entity.id}`);
    } catch (error) {
      this.logger.error('❌ Error sending message to Kafka:', error);
      // Following Java pattern: onErrorResume(ex -> Mono.empty()) - don't throw, just log
      // This allows the transaction to complete even if Kafka fails
    }
  }

  /**
   * Convert transaction to JSON - equivalent to convertTransactionToJson() in Java
   */
  private convertTransactionToJson(entity: Transaction): string {
    try {
      const rawTransaction = RawTransaction.builder()
        .id(entity.id)
        .amount(entity.amount)
        .build();

      return JSON.stringify(rawTransaction);
    } catch (error) {
      this.logger.error('❌ Error converting transaction to JSON:', error);
      throw new InternalServerErrorException(`Failed to convert transaction to JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
