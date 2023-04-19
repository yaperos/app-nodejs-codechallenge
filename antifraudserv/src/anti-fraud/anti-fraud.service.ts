import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { KafkaClient } from './kafka-client.service';

@Injectable()
export class AntiFraudService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: KafkaClient,
  ) {}

  /**
   * Conex con Kafka y escucha de los mensajes en el topic 'transaction_created'
   */
  async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
    this.listenToTransactionCreated();
  }

  /**
   * Desconect del cliente Kafka
   */
  async onModuleDestroy(): Promise<void> {
    await this.kafkaClient.disconnect();
  }

  /**
   * Escucha de los mensajes en el topic 'transaction_created'
   */
  async listenToTransactionCreated(): Promise<void> {
    await this.kafkaClient.consumeMessage('transaction_created', (messageData) => {
      console.log('Mensaje recibido en el Servicio Anti Fraude:', messageData);

      this.validateTransaction(messageData);
    });
  }

  /**
   * Validacion de la transacción y envío de mensaje al topic 'transaction_validation_result'
   * @param messageData Msg recibido del topic 'transaction_created'
   */
  async validateTransaction(messageData: any): Promise<void> {
    const transactionExternalId: string = messageData.transactionExternalId;
    const value: number = messageData.value;

    const maxTransactionValue: number = 1000;
    const approvedResult: string = 'Transfrencia Aprobada (Approved)';
    const rejectedResult: string = 'Transfrencia Rechazada (Rejected)';

    // Verif si la trans es aprobada o rechazada
    const validationResult: string = value <= maxTransactionValue ? approvedResult : rejectedResult;

    this.kafkaClient.sendMessage({
      topic: 'transaction_validation_result',
      key: transactionExternalId,
      value: JSON.stringify({
        transactionExternalId: transactionExternalId,
        result: validationResult,
      }),
    }); // Msg al topic 'transaction_validation_result' con el resultado de la validación
  }
}
