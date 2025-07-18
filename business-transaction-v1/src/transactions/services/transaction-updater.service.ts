import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transaction.entity';
import { ValidationResultDto } from '../dto/validation-result.dto';
import { ITransactionUpdater } from '../interfaces/transaction-updater.interface';
import { ApplicationPropertiesService } from '../../config/application-properties.service';

@Injectable()
export class TransactionUpdaterService implements ITransactionUpdater {
  private readonly logger = new Logger(TransactionUpdaterService.name);

  constructor(
    @InjectRepository(Transaction) private repo: Repository<Transaction>,
    private readonly applicationProperties: ApplicationPropertiesService,
  ) {}

  async updateTrx(validationResult: ValidationResultDto): Promise<void> {
    try {
      const transactionEntity = await this.repo.findOneBy({ id: validationResult.transactionId });
      if (!transactionEntity) {
        throw new NotFoundException(`Transaction with ID ${validationResult.transactionId} not found`);
      }

      await this.updateTransactionEntity(transactionEntity, validationResult);

    } catch (error) {
      this.handleError(error);
    }
  }

  private async updateTransactionEntity(
    transactionEntity: Transaction, 
    validationResult: ValidationResultDto
  ): Promise<Transaction> {
    try {
      // Usar applicationProperties para obtener los estados correctos
      const trxStatuses = this.applicationProperties.getTrxStatuses();
      const status = validationResult.isFraudulent ? trxStatuses.rejected : trxStatuses.approved;

      transactionEntity.status = status;
      transactionEntity.updatedAt = new Date();

      return await this.repo.save(transactionEntity);

    } catch (error) {
      this.logger.error(`Error updating transaction in PostgreSQL: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private handleError(error: unknown): never {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    this.logger.error(`Error processing transaction update: ${errorMessage}`);
    
    if (error instanceof NotFoundException) {
      throw error;
    }
    
    throw new InternalServerErrorException('Database error during transaction update');
  }
}
