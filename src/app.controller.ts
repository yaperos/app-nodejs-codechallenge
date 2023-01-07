import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { TransactionRequest } from './models/transaction.request';
import { TransactionResponse } from './models/transaction.response';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('challenger-client')
    private readonly cliente: ClientProxy
  ) { }

  //Awaits for incoming transactions and redirects to its propper topic
  @MessagePattern('transaction.pending')
  public transactionIncoming(@Payload() payload: any) {
    let transacRq = TransactionResponse.fromRaw(payload);
    let transac = transacRq.toTransaction()
    if (transac.value > 1000)
      this.cliente.emit('transaction.rejected', JSON.stringify(transacRq));
    else
      this.cliente.emit('transaction.approved', JSON.stringify(transacRq));

    Logger.log( JSON.stringify(transac), AppController.name);
  }

}
