import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { config } from 'dotenv';

import { ValidateTransactionDto } from './dto/validate-transaction';

config();

@Injectable()
export class AntifraudService {

  constructor(@Inject(process.env.KAFKA_NAME) private readonly client: ClientKafka, private readonly httpService: HttpService,) { }

  validateTransaction(validateTransactionDto: ValidateTransactionDto): string {
    const { value } = validateTransactionDto;

    const isValid = value < 1000;

    const transactionStatus = isValid ? 'approved' : 'rejected';

    return transactionStatus;
  }

  async sendTransactionUpdate(updatedTransaction: any) {
    try {

      const antifraudResponse = await this.httpService
        .put('/transactions/' + updatedTransaction.transactionExternalId, updatedTransaction)
        .toPromise();
      return antifraudResponse.data;

    } catch (error) {
   
      throw new BadRequestException('Invalid request');

    }
  }
}