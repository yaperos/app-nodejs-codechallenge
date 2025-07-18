import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { GetTransactionResponseDto } from './dto/get-transaction-response.dto';
import { ValidationResultDto } from './dto/validation-result.dto';
import { 
  ITransactionService
} from './interfaces';
import { TransactionCreatorService } from './services/transaction-creator.service';
import { TransactionReaderService } from './services/transaction-reader.service';
import { TransactionUpdaterService } from './services/transaction-updater.service';
import { TransactionDeleterService } from './services/transaction-deleter.service';

/**
 * Main Transaction Service implementing Interface Segregation Principle
 * Composes segregated services instead of implementing all methods directly
 * Each responsibility is delegated to a specific service
 */
@Injectable()
export class TransactionService implements ITransactionService {
  
  constructor(
    private readonly creatorService: TransactionCreatorService,
    private readonly readerService: TransactionReaderService,
    private readonly updaterService: TransactionUpdaterService,
    private readonly deleterService: TransactionDeleterService,
  ) {}

  // ITransactionCreator methods - delegated to creatorService
  async createTrx(request: CreateTransactionDto): Promise<TransactionResponseDto> {
    return this.creatorService.createTrx(request);
  }

  async create(data: CreateTransactionDto): Promise<TransactionResponseDto> {
    return this.createTrx(data);
  }

  // ITransactionReader methods - delegated to readerService
  async findAll(): Promise<GetTransactionResponseDto[]> {
    return this.readerService.findAll();
  }

  async findOne(id: string): Promise<GetTransactionResponseDto> {
    return this.readerService.findOne(id);
  }

  async getTrx(transactionExternalId: string): Promise<GetTransactionResponseDto> {
    return this.readerService.getTrx(transactionExternalId);
  }

  // ITransactionUpdater methods - delegated to updaterService
  async updateTrx(validationResult: ValidationResultDto): Promise<void> {
    return this.updaterService.updateTrx(validationResult);
  }

  // ITransactionDeleter methods - delegated to deleterService
  async remove(id: string): Promise<void> {
    return this.deleterService.remove(id);
  }
}
