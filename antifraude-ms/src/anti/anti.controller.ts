/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiService } from './anti.service';

@Controller('antifraude')
export class AntiController {
  constructor(private readonly antiService: AntiService) {}

  @MessagePattern('transaction.validate')
  handleUserCreate(@Payload() data: any) {
    const { transactionId, value } = data;
    console.log({ transactionId, value });
    this.antiService.emitMessage(data);
  }
}
