import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('ANTIFRAUD_SERVICE') private readonly client: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('transaction.verify')
  async validateTransaction(@Payload() transactionPayload: transactionDTO) {
    return {
      requestID: transactionPayload.transactionExternalId,
      isValid: await this.appService.validateAmount(
        transactionPayload.transactionAmount,
      ),
    };
  }
}

export interface transactionDTO {
  transactionExternalId: string;
  transactionAmount: number;
}
