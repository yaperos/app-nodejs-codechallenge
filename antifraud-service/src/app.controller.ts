import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionPayloadDto } from './transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('antifraudVerification')
  verifyTransaction(@Payload() payload: CreateTransactionPayloadDto) {
    this.appService.verifyTransaction(payload);
  }
}
