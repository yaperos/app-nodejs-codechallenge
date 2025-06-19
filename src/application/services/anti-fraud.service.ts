import { Injectable, Inject } from '@nestjs/common';
import { UpdateTransactionStatusUseCase } from '@domain/use-cases/update-transaction-status.use-case';
import { TransactionStatusUpdatedEvent } from '@domain/ports/anti-fraud.port';
import { TransactionStatus } from '@domain/entities/transaction-status.enum';
import { LoggerPort } from '@domain/ports/logger.port';

@Injectable()
export class AntiFraudService {
  constructor(
    private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase,
    @Inject('LoggerPort') private readonly logger: LoggerPort,
  ) {}

  async processTransactionStatusUpdate(
    event: TransactionStatusUpdatedEvent,
    correlationId?: string,
  ): Promise<void> {
    this.logger.info(
      `Procesando actualización de estado de transacción: ${event.transactionExternalId} -> ${event.status}`,  
      'AntiFraudService',
      correlationId,
    );

    try {
      const status = event.status === 'approved' 
        ? TransactionStatus.APPROVED 
        : TransactionStatus.REJECTED;

      await this.updateTransactionStatusUseCase.execute(
        event.transactionExternalId,
        status,
        correlationId,
      );
      
      this.logger.info(
        `Estado de transacción actualizado exitosamente: ${event.transactionExternalId}`,
        'AntiFraudService',
        correlationId,
      );
    } catch (error) {
      this.logger.error(
        `Error al procesar actualización de estado de transacción: ${event.transactionExternalId}`,
        error as Error,
        'AntiFraudService',
        correlationId,
      );
      throw error;
    }
  }
} 