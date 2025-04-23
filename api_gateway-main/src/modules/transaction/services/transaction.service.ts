import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  TRANSACTION_SERVICE_CM,
  TRANSACTION_SERVICE_QR,
} from 'src/config/services';
import { CreateTransactionRequestDto } from '../dtos/create-transaction-request.dto';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    @Inject(TRANSACTION_SERVICE_QR) private readonly clientQr: ClientKafka,
    @Inject(TRANSACTION_SERVICE_CM) private readonly clientCM: ClientKafka,
  ) {}

  async onModuleInit() {
    this.clientQr.subscribeToResponseOf('transaction.detail');
    this.clientCM.subscribeToResponseOf('transaction.create');
    await this.clientQr.connect();
    await this.clientCM.connect();
  }

  getTransaction(id: string) {
    return this.clientQr.send('transaction.detail', {
      externalId: id,
    });
  }

  createTransaction(data: CreateTransactionRequestDto) {
    return this.clientCM.send('transaction.create', { data });
  }
}
