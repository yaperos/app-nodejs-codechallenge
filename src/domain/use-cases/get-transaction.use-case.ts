import { Inject, Injectable } from '@nestjs/common';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionRepositoryPort } from '../ports/transaction-repository.port';
import { LoggerPort } from '../ports/logger.port';

@Injectable()
export class GetTransactionUseCase {
  constructor(
    @Inject('TransactionRepositoryPort') private readonly transactionRepository: TransactionRepositoryPort,
    @Inject('LoggerPort') private readonly logger: LoggerPort,
  ) {}

  async execute(
    transactionExternalId: string,
    correlationId?: string,
  ): Promise<TransactionEntity | null> {
    this.logger.info(
      `Obteniendo transacción: ${transactionExternalId}`,
      'GetTransactionUseCase',
      correlationId,
    );

    try {
      const transaction = await this.transactionRepository.findByExternalId(
        transactionExternalId,
      );

      if (!transaction) {
        this.logger.warn(
          `Transacción no encontrada: ${transactionExternalId}`,
          'GetTransactionUseCase',
          correlationId,
        );
        return null;
      }

      this.logger.info(
        `Transacción encontrada: ${transactionExternalId}`,
        'GetTransactionUseCase',
        correlationId,
      );

      return transaction;
    } catch (error) {
      this.logger.error(
        `Error al obtener transacción: ${transactionExternalId}`,
        error as Error,
        'GetTransactionUseCase',
        correlationId,
      );
      throw error;
    }
  }
} 