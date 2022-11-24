import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionValidatedEvent } from 'src/transactionEvent';
import { StatusObjectI } from './interfaces/status.interface';

@Injectable()
export class AppService implements OnModuleInit{
  private respuesta;
  constructor(
    @Inject('ANTI-FRAUD') private readonly antiFraud: ClientKafka,
  ) {}

  onModuleInit() {
    this.respuesta = this.antiFraud.subscribeToResponseOf('antiFraud.get');
  }

  getHello(): string {
    return 'Hello World!';
  }

  handleTrasactionCreated({id, tranferTypeId, value, statusArray}: TransactionValidatedEvent) {
    console.log("Transaction received:")
    console.log(`ID: ${id} || Type: ${tranferTypeId} | Value: ${value}`)
    // console.log(`Status ${statusArray[0].status}`)
    console.log(`Status: Pending`)
    const transactionStatusChanged: StatusObjectI = {status: 'rejected'};
    if (value > 1000) {
      transactionStatusChanged.status = 'rejected';
    } else {
      transactionStatusChanged.status = 'approved'
    }
    statusArray = transactionStatusChanged;
    console.log(`Result: ${transactionStatusChanged.status}`)
    console.log("/".repeat(20))
    return {id, tranferTypeId, value, statusArray};
  }
}