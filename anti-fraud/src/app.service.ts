/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { TransactionRequestDto } from './dto/request/transaction.request.dto';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionStatusResponseDto } from './dto/response/transaction-status.response.dto';
import { TransactionStatus } from './constans/transaction-status.enum';
import { UPDATE_TRANSACTION_STATUS_APPROVED_TOPIC, UPDATE_TRANSACTION_STATUS_REJECTED_TOPIC } from './constans/kafka-topics';
import { MAX_VALUE_TO_APPROVE_TRANSACTION } from './constans/commons';

@Injectable()
export class AppService {

  constructor(
    @Inject('FINANCIAL_TRANSACTIONS_MICROSERVICE') private readonly kafkaClient: ClientKafka,
  ) { }

  handleVerifyTransaction(orderCreatedEvent: TransactionRequestDto) {
    console.log("SIMULATION PROCESS OF ANTI-FRAUD...PROCESS IN 8 SECONDS")
    let transactionStatus = null;
    setTimeout(() => {
      transactionStatus = this.validateTransaction(orderCreatedEvent);
      this.sendEventToTransactionUpdate(transactionStatus, orderCreatedEvent);
    }, 8000);


  }

  private validateTransaction(orderCreatedEvent: TransactionRequestDto): string {
    if (orderCreatedEvent.value > MAX_VALUE_TO_APPROVE_TRANSACTION) {
      return TransactionStatus.REJECTED;
    }
    return TransactionStatus.APPROVED;
  }

  private sendEventToTransactionUpdate(transactionStatus: string, orderCreatedEvent: TransactionRequestDto): void {
    const message = new TransactionStatusResponseDto(orderCreatedEvent.transactionExternalId, transactionStatus)
    let messageTopic = null;
    if (transactionStatus == TransactionStatus.REJECTED) {
      messageTopic = UPDATE_TRANSACTION_STATUS_REJECTED_TOPIC;
    } else if (transactionStatus == TransactionStatus.APPROVED) {
      messageTopic = UPDATE_TRANSACTION_STATUS_APPROVED_TOPIC;
    }
    this.kafkaClient
      .emit(messageTopic, JSON.stringify(message))
  }
}
