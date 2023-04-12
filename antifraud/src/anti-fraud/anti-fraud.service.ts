import { Injectable, Inject } from '@nestjs/common';
import { KafkaClient } from './kafka-client.service'; // Importa KafkaClient desde el archivo correspondiente

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: KafkaClient,
  ) {}

  async onModuleInit() {
    this.listenToTransactionCreated();
  }

  async listenToTransactionCreated() {
    await this.kafkaClient.consumeMessage('transaction_created', (messageData) => {
      console.log('Mensaje recibido en AntiFraudService:', messageData);

      // Llama a la función para validar la transacción
      this.validateTransaction(messageData);
    });
  }

  async validateTransaction(messageData: any): Promise<void> {
    const transactionExternalId = messageData.transactionExternalId;
    const value = messageData.value;

    const validationResult = value <= 1000 ? 'Aprobado' : 'Rechazado';

    // Enviar el resultado de la validación de vuelta a Kafka
    this.kafkaClient.sendMessage({ topic: 'transaction_validation_result', key: transactionExternalId, value: JSON.stringify({
      transactionExternalId: transactionExternalId,
      result: validationResult,
    }) });
  }
}
