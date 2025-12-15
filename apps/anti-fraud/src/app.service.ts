import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  handleTransactionCreated(data: any) {
    const transaction = typeof data === 'string' ? JSON.parse(data) : data;
    
    console.log(`[Anti-Fraud] Analizando transacción: ${transaction.transactionExternalId} con valor ${transaction.value}`);

    const isFraud = transaction.value > 1000;
    const newStatus = isFraud ? 'REJECTED' : 'APPROVED';

    console.log(`[Anti-Fraud] Resultado: ${newStatus}. Enviando evento...`);
    
    this.kafkaClient.emit('transaction_status_update', JSON.stringify({
      transactionExternalId: transaction.transactionExternalId,
      status: newStatus,
    }));
  }
}