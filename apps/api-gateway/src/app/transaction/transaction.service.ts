import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionDto } from '@app-nodejs-codechallenge/shared/dto';
import { Transaction } from '@app-nodejs-codechallenge/shared/entities';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_MICROSERVICE') private readonly transactionClient: ClientKafka,
    @Inject('ANTIFRAUD_MICROSERVICE') private readonly antifraudClient: ClientKafka
  ) { }

  createTransaction(createTransactionDto: CreateTransactionDto) {
    return new Promise(resolve => {
      this.transactionClient.send('transaction.create', JSON.stringify(createTransactionDto)).subscribe((transaction: Transaction) => {
        // this.antifraudClient
        this.transactionClient.send('antifraud.evalue', JSON.stringify(transaction)).subscribe((status: string) => {
          transaction.transactionStatus = status;
          this.transactionClient.send('transaction.update', JSON.stringify(transaction)).subscribe((transactionUpdated: Transaction) => {
            return resolve(transactionUpdated);
          });
        });
      });
    });
  }

  onModuleInit() {
    this.transactionClient.subscribeToResponseOf('transaction.create');
    this.transactionClient.subscribeToResponseOf('transaction.update');
    this.transactionClient.subscribeToResponseOf('antifraud.evalue');
    this.transactionClient.connect();
  }
}