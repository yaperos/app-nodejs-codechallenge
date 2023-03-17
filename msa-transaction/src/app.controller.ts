import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController implements OnModuleInit{
  constructor(
    private readonly appService: AppService,
    @Inject('ANTIFRAUD_SERVICE') private readonly antiFraud:ClientKafka
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('yapev2_transaction_created')
  handleTransactionCreated(data:any){
    this.appService.handleTransactionCreated(data.value)
  }
  onModuleInit() {
    this.antiFraud.subscribeToResponseOf('get_validate_fraud')
  }
}
