import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('transaction.verify')
  async validateTransaction(@Payload() transactionPayload: transactionDTO) {
    console.log('VALIDATE TRANSACTION: ', transactionPayload);
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
