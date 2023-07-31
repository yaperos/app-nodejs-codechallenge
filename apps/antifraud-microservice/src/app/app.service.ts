import { CreateTransactionDto } from '@nestjs-microservices/shared/dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from '@nestjs-microservices/shared/entities';
@Injectable()
export class AppService {
  constructor(
    @Inject('ANTIFRAUD_MICROSERVICE')
    private readonly antifraudClient: ClientKafka
  ) {}

  processTransaction(transaction: Transaction) {
    console.log('Processing transaction!');
    let transactionStatus: 'approved' | 'rejected';
    console.log('Transaction created', transaction);

    if (transaction.value > 1000) {
      transactionStatus = 'rejected';
    } else {
      transactionStatus = 'approved';
    }
    console.log('Emitting transaction.status event');
    this.antifraudClient.emit(
      `transaction.status`,
      JSON.stringify({ transactionId: transaction.id, transactionStatus })
    );
  }
}
