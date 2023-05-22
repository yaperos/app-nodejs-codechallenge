import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { AntiFraudeDTO } from './dtos/anti-fraude.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('transaction_created')
  handleEventVerifyTransaction(@Payload() data: AntiFraudeDTO) {
    return this.appService.antiFraudVerify(data);
  }
  
}
