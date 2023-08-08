import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MsAntifraudService {
  constructor(
    @Inject('MS_TRANSACTION') private readonly clientAntifraud: ClientProxy,
  ) {}
  validateValue(value: number) {
    let response = {
      state: true,
      message: 'The transaction is approved',
    };
    if (value > 1000) {
      response = {
        state: false,
        message: 'The transaction is rejected',
      };
      this.clientAntifraud.emit('transaction_rejected_event', response);
    } else {
      this.clientAntifraud.emit('transaction_approved_event', response);
    }
    console.log('se validó el dato');
    return response;
  }
}
