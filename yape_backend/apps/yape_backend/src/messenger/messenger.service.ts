import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from '@prisma/client';

@Injectable()
export class MessengerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('ANTI_FRAUD_SERVICE')
    private readonly antiFraudMsServiceClient: ClientKafka,
  ) {}

  public handleAnalizeTransaction(message: any): Promise<any> {
    console.log(message);

    let transaction: Transaction;
    return new Promise((resolve, reject) => {
      this.antiFraudMsServiceClient
        .send('transaction.analize', JSON.stringify(message))
        .subscribe({
          next: (trx) => {
            transaction = trx;
          },
          error: (error) => {
            reject(error);
          },
          complete: () => {
            resolve(transaction);
          },
        });
    });
  }

  async onModuleInit() {
    ['transaction.analize'].forEach((pattern) => {
      this.antiFraudMsServiceClient.subscribeToResponseOf(pattern);
    });
    this.antiFraudMsServiceClient.connect();
  }

  onModuleDestroy() {
    this.antiFraudMsServiceClient.close();
  }
}
