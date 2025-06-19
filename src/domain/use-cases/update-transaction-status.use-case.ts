import { Inject, Injectable } from '@nestjs/common';
import { TransactionStatus } from '../entities/transaction-status.enum';
import { TransactionRepositoryPort } from '../ports/transaction-repository.port';
import { LoggerPort } from '../ports/logger.port';

@Injectable()
export class UpdateTransactionStatusUseCase {
  constructor(
    @Inject('TransactionRepositoryPort') private readonly transactionRepository: TransactionRepositoryPort,
    @Inject('LoggerPort') private readonly logger: LoggerPort,
  ) {}

  async execute(
    transactionExternalId: string,
    status: TransactionStatus,
    correlationId?: string,
  ): Promise<void> {
    this.logger.info(
      `Actualizando estado de transacción: ${transactionExternalId} a ${status}`,
      'UpdateTransactionStatusUseCase',
      correlationId,
    );

    try {
      // Validar el estado
      if (!Object.values(TransactionStatus).includes(status)) {
        throw new Error(`Estado de transacción inválido: ${status}`);
      }

      // Actualizar el estado de la transacción
      await this.transactionRepository.updateStatus(transactionExternalId, status);

      this.logger.info(
        `Estado de transacción actualizado exitosamente: ${transactionExternalId} -> ${status}`,
        'UpdateTransactionStatusUseCase',
        correlationId,
      );
    } catch (error) {
      this.logger.error(
        `Error al actualizar estado de transacción: ${transactionExternalId}`,
        error as Error,
        'UpdateTransactionStatusUseCase',
        correlationId,
      );
      throw error;
    }
  }
} 