import { Controller, Get } from '@nestjs/common';
import { AntiFraudMsService } from './anti-fraud-ms.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AntiFraudMsController {
  constructor(private readonly antiFraudMsService: AntiFraudMsService) {}

  @Get()
  getHello(): string {
    return this.antiFraudMsService.getHello();
  }

  @MessagePattern('transaction.analize')
  async create(@Payload() createTransactionDto: any) {
    console.log('Hoooooooola');

    return await this.antiFraudMsService.analizeTransaction(
      createTransactionDto,
    );
  }
}
