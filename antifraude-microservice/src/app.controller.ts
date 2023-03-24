import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    return 'Hello world';
  }

  @EventPattern('order_created')
  async handleOrderCreated(data: any) {
    return await this.appService.handleTransactionCreated(data.value);
  }

  
}
