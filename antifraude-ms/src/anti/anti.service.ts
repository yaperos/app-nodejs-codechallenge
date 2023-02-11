/* eslint-disable @typescript-eslint/no-empty-function */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AntiService {
  constructor(@Inject('ANTIFRAUDE_MS') private readonly client: ClientProxy) {}

  emitMessage(data: any) {
    const { transactionId, value } = data;
    this.validateValue(Number(value))
      ? this.emitMessageGeneric(transactionId, 'approved')
      : this.emitMessageGeneric(transactionId, 'rejected');
  }

  validateValue(amount: number): boolean {
    return amount > 1000 ?? false;
  }

  emitMessageGeneric(transactionId: string, status: string) {
    this.client.emit(
      'antifraude.validate',
      JSON.stringify({ transactionId, status }),
    );
  }
}
