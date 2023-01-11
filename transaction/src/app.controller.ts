import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('ANTI_FRAUD_SERVICE')
    private readonly validateTrasactionClient: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('transaction_created')
  async transactionCreated(@Payload() data: any) {
    const result = await this.appService.transactionCreated(data.transaction);
    return result;
  }

  async onModuleInit() {
    this.validateTrasactionClient.subscribeToResponseOf('validate_transaction');
    await this.validateTrasactionClient.connect();
  }
}
