import { Controller, Get, Inject } from '@nestjs/common';
import { Client, ClientKafka, Ctx, EventPattern, KafkaContext, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { KafkaEnum } from 'apps/shared/enum/kafka-config.enum';
import { AntiFraudService } from './anti-fraud.service';

@Controller()
export class AntiFraudController {

  constructor(private readonly antiFraudService: AntiFraudService) {}

  @MessagePattern('transaction')
  handleTransactionCreate(@Payload() data: any) {
    console.log(data)
    this.antiFraudService.validGreater(data);
  }


}
