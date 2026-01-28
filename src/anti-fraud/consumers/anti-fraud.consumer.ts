import { Controller, Logger } from '@nestjs/common';
import { AntiFraudService } from '../services/anti-fraud.service';

// Interfaz para mensajes de Kafka
interface KafkaTransactionMessage {
  transactionExternalId: string;
  value: number;
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
  timestamp?: string;
}

@Controller()
export class AntiFraudConsumer {
  private readonly logger = new Logger(AntiFraudConsumer.name);

  constructor(private readonly antiFraudService: AntiFraudService) {}

  /**
   * Método que simula recibir mensajes de Kafka
   */
  async handleTransactionCreated(message: KafkaTransactionMessage): Promise<void> {
    try {
      this.logger.log(`📨 Recibiendo transacción para validación: ${JSON.stringify(message)}`);

      const { transactionExternalId, value, accountExternalIdDebit } = message;

      // Validar la transacción
      const validationResult = await this.antiFraudService.validateTransactionWithHistory(
        value,
        accountExternalIdDebit || 'unknown',
      );

      // Simular envío de respuesta (en producción sería a Kafka)
      await this.sendValidationResult({
        transactionExternalId,
        status: validationResult.status,
        rejectionReason: validationResult.rejectionReason,
        score: validationResult.score,
        validatedAt: new Date().toISOString(),
      });

      this.logger.log(
        `✅ Validación completada para ${transactionExternalId}: ${validationResult.status}`,
      );

    } catch (error) {
      this.logger.error(`❌ Error procesando transacción: ${error.message}`);
    }
  }

  /**
   * Método que sería llamado por el TransactionsService cuando se crea una transacción
   */
  async processTransactionValidation(
    transactionExternalId: string,
    value: number,
    accountId?: string,
  ): Promise<void> {
    const message: KafkaTransactionMessage = {
      transactionExternalId,
      value,
      accountExternalIdDebit: accountId,
      timestamp: new Date().toISOString(),
    };

    await this.handleTransactionCreated(message);
  }

  private async sendValidationResult(result: {
    transactionExternalId: string;
    status: 'approved' | 'rejected';
    rejectionReason?: string;
    score?: number;
    validatedAt: string;
  }): Promise<void> {
    
    this.logger.debug(`📤 Simulando envío a Kafka - Resultado: ${JSON.stringify(result)}`);

  }

  /**
   * Método para simular consumo batch de mensajes
   */
  async processBatch(messages: KafkaTransactionMessage[]): Promise<void> {
    this.logger.log(`🔄 Procesando batch de ${messages.length} transacciones`);
    
    const promises = messages.map((message, index) => 
      this.processWithDelay(message, index * 100) // Procesar con delay para simular concurrencia
    );
    
    await Promise.all(promises);
    this.logger.log('✅ Batch procesado exitosamente');
  }

  private async processWithDelay(message: KafkaTransactionMessage, delay: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(async () => {
        await this.handleTransactionCreated(message);
        resolve();
      }, delay);
    });
  }
}