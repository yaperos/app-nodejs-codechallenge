import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { IRequestTransactionCreate, IResponseTransactionCreate } from './interfaces/create-transaction';

@Injectable()
export class ApiGatewayService implements OnModuleInit {
  constructor(
    @Inject('MOTIONS_SERVICE')
    protected readonly gatewayService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.gatewayService.subscribeToResponseOf('createTransactionDb');
    await this.gatewayService.connect();
  }

  createTransaction(data: IRequestTransactionCreate): Observable<IResponseTransactionCreate> {
    const pattern = 'createTransactionDb';
    const payload = JSON.stringify(data);
    return this.gatewayService.send<IResponseTransactionCreate>(
      pattern,
      payload,
    );
  }
}
