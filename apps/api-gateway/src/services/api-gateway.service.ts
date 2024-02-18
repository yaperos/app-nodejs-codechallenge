import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { TransactionData, TransactionResponse } from '../interfaces/transaction';

@Injectable()
export class ApiGatewayService implements OnModuleInit {
  constructor(
    @Inject('MOTIONS_SERVICE')
    protected readonly gatewayService: ClientKafka
  ) { }

  async onModuleInit() {
    this.gatewayService.subscribeToResponseOf('createTransaction');
    await this.gatewayService.connect();
  }

  private validateTransactionData(data: TransactionData) {
    if (!data.accountExternalIdDebit && !data.accountExternalIdCredit) {
      throw new ValidationError('Invalid account external id');
    }

    if (data.accountExternalIdDebit && typeof data.accountExternalIdDebit !== 'string') {
      throw new ValidationError('Invalid account external id debit');
    }

    if (data.accountExternalIdCredit && typeof data.accountExternalIdCredit !== 'string') {
      throw new ValidationError('Invalid account external id credit');
    }

    if (
      !data.tranferTypeId
      || typeof data.tranferTypeId !== 'number'
      || ![1,2].includes(data.tranferTypeId)
    ) {
      throw new ValidationError('Invalid transfer type');
    }

    if (
      !data.value
      || typeof data.value !== 'number'
      || data.value <= 0
    ) {
      throw new ValidationError('Invalid value');
    }
  }

  createTransaction(data: TransactionData): Observable<TransactionResponse> {
    try {
      this.validateTransactionData(data);

      const pattern = 'createTransaction';
      const payload = JSON.stringify(data);

      return this.gatewayService.send<TransactionResponse>(pattern, payload);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestError(error.message);
      } else {
        throw new InternalServerError();
      }
    }
  }
}

export class ValidationError extends Error {}
export class BadRequestError extends Error {}
export class InternalServerError extends Error {}
