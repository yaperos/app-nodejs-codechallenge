import { Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionCreatedEvent } from './events/transaction-created.event';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { GetAntifraudRequest } from './requests/get-antifraud-request.dto';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }



}
