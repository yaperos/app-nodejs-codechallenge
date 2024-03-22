// anti-fraud.controller.ts
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from 'src/anti-fraud/app/anti-fraud.service';

@Controller('anti-fraud')
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @MessagePattern('transactions')
  async validateTransaction(@Payload() data: any) {
   
    
    const response = await this.antiFraudService.handleTransactionRequest(data);

    this.antiFraudService.sendStatusTransaction(response);


  }
}
