import { Controller } from '@nestjs/common';
import { AntiFraudReceiverService } from './anti-fraud-receiver.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AntiFraudReceiverController {
  constructor(private readonly antiFraudReceiverService: AntiFraudReceiverService) {}



  @EventPattern('anti-success')
  async handleAntiSuccess(data: any) {
    return await this.antiFraudReceiverService.handleAntiSuccess(data);
  }

  @EventPattern('anti-wrong')
  async handleAntiWrong(data: any) {
    return await this.antiFraudReceiverService.handleAntiWrong(data);
  }


}
