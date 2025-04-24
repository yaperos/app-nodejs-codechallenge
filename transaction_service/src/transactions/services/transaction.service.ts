import { Injectable, Inject, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { TransactionResponseDto } from '../dto/create-transaction-response.dto';
import { v4 as uuidv4 } from 'uuid';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { hasRequiredKeys } from '../utils/type-guards';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) { }

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

      return TransactionResponseDto.fromEntity(savedTransaction);

    } catch (error) {
      this.logger.error(`Failed to create transaction or emit event: ${error.message}`, error.stack);
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
      return transaction;
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

  async updateCache(
    transactionExternalId: string,
    partialData: Partial<TransactionResponseDto>
  ): Promise<void> {
    const cacheKey = `PK-${transactionExternalId}`;
    this.logger.debug(`Attempting cache update for ${cacheKey} with data: ${JSON.stringify(partialData)}`);

    try {
      const existingCachedData = await this.cacheManager.get<TransactionResponseDto>(cacheKey);

      if (!existingCachedData) {
        this.logger.log(`No existing cache data found for ${transactionExternalId}, creating new entry.`);
        await this.cacheManager.set(cacheKey, partialData, 3600);
        return;
      }

      this.logger.log(`Existing cache data found for ${transactionExternalId}, merging with new data.`);

      let mergedData: TransactionResponseDto

      const isFullData = hasRequiredKeys<TransactionResponseDto>(partialData, TransactionResponseDto.arguments)

      if (isFullData) {
        this.logger.log(`Full data received for ${transactionExternalId}, updating cache.`);

        mergedData = {
          ...existingCachedData,
          ...partialData,
        }

        await this.cacheManager.set(cacheKey, mergedData, 3600);
        return;
      }

      this.logger.log(`Partial data received for ${transactionExternalId}, updating cache.`);

      mergedData = {
        ...existingCachedData,
        ...partialData,
      }

      await this.cacheManager.set(cacheKey, mergedData, 3600);
      this.logger.log(`Cache updated for ${transactionExternalId}`);

    } catch (error) {
      this.logger.error(`Failed to update cache for ${transactionExternalId}: ${error.message}`, error.stack);
    }
  }


  async getTransactionFromCache(transactionExternalId: string): Promise<TransactionResponseDto> {
    const cacheKey = `PK-${transactionExternalId}`;
    this.logger.log(`Workspaceing transaction from Read DB (Redis Cache): ${cacheKey}`);
    try {
      const cachedData = await this.cacheManager.get<TransactionResponseDto>(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache HIT for ${transactionExternalId}`);
        return cachedData;
      } else {
        this.logger.log(`Cache MISS for ${transactionExternalId}`);

        const response = await this.findTransactionById(transactionExternalId)
        return response as TransactionResponseDto
      }
    } catch (error) {
      this.logger.error(`Failed to read from cache for ${transactionExternalId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to access transaction data.');
    }
  }
}