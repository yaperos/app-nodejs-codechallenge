import { Inject, Injectable } from '@nestjs/common';
import { TransactionEntity, CreateTransactionParams } from '../entities/transaction.entity';
import { TransactionRepositoryPort } from '../ports/transaction-repository.port';
import { AntiFraudPort } from '../ports/anti-fraud.port';
import { LoggerPort } from '../ports/logger.port';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('TransactionRepositoryPort') private readonly transactionRepository: TransactionRepositoryPort,
    @Inject('AntiFraudPort') private readonly antiFraudService: AntiFraudPort,
    @Inject('LoggerPort') private readonly logger: LoggerPort,
  ) {}

  async execute(
    params: CreateTransactionParams,
    correlationId?: string,
  ): Promise<TransactionEntity> {
    this.logger.info(
      `Creando transacción con valor: ${params.value}`,
      'CreateTransactionUseCase',
      correlationId,
    );

    const transaction = TransactionEntity.create(params);

    try {
      const savedTransaction = await this.transactionRepository.save(transaction);

      this.logger.info(
        `Transacción creada exitosamente: ${savedTransaction.transactionExternalId}`,
        'CreateTransactionUseCase',
        correlationId,
      );

      // Enviar al servicio anti-fraude de forma asíncrona
      // No esperar para evitar bloquear la respuesta
      this.antiFraudService
        .sendTransactionCreated(savedTransaction)
        .catch((error) => {
          this.logger.error(
            `Error al enviar transacción al servicio anti-fraude: ${savedTransaction.transactionExternalId}`,
            error,
            'CreateTransactionUseCase',
            correlationId,
          );
        });

      return savedTransaction;
    } catch (error) {
      this.logger.error(
        `Error al crear transacción`,
        error as Error,
        'CreateTransactionUseCase',
        correlationId,
      );
      throw error;
    }
  }
} 