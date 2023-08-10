import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CheckTransactionDto } from './check-transaction.dto';
import { TransactionStatus } from './core/constants';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTI_FRAUD_EMITTER') private readonly kafkaClient: ClientKafka,
  ) {}

  // Método para verificar la transacción
  verifyTransaction(transaction: CheckTransactionDto) {
    console.log(transaction, 'transaction');
    
    // Extraer propiedades de la transacción
    const { transactionExternalId, value } = transaction;
    
    // Determinar el estado de la transacción
    const status =
      value > 1000 ? TransactionStatus.REJECTED : TransactionStatus.APPROVED;

    // Enviar mensaje a través de Kafka para actualizar la transacción
    return this.kafkaClient.emit(
      'update-transaction',
      JSON.stringify({ transactionExternalId, status }),
    );
  }
}
