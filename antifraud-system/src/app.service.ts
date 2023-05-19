import { Injectable } from '@nestjs/common';
import { TransactionFull } from './entities/transaction.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AntiFraudService {
  constructor(private readonly httpService: HttpService) {}

  async verifyTransaction(transaction: TransactionFull) {
    if (transaction.value > 1000) {
      transaction.status = 'rejected';
    } else {
      transaction.status = 'approved';
    }

    try {
      const response = await this.httpService
        .put('http://transaction-api:3000/transactions', transaction)
        .toPromise();
    } catch (error) {
      throw new Error('Error al crear la transacción: ' + error);
    }

    return transaction;
  }
}
