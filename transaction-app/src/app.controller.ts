import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { CreateTransactionRequest } from './requests/create-transaction-request.dto';

@Controller()
export class AppController implements OnModuleInit {
  constructor(private readonly appService: AppService, @Inject('ANTIFRAUD_SERVICE') private readonly antifraudClient: ClientKafka) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('transaction-created')
  handleTransactionCreateds(createTransactionRequest: CreateTransactionRequest) {

    this.appService.handleTransactionCreated(createTransactionRequest)
  }

  onModuleInit() {
    this.antifraudClient.subscribeToResponseOf('validate-transaction')
  }
}
