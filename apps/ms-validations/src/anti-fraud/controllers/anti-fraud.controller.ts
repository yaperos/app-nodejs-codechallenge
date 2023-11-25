import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { AntiFraudService } from '../services/anti-fraud.service';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class AntiFraudController {
  private readonly _logger = new Logger(AntiFraudController.name);
  constructor(
    @Inject('IkafkaService')
    private readonly antiFraudService: AntiFraudService,
  ) {}

  /*   @Get()
  getHello(): string {
    return this.antiFraudService.getHello();
  } */

  @MessagePattern('new_transaction')
  async handleNewTransaction(
    @Payload() data: any,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    this._logger.debug(
      `Data: ${data} Topic: ${context.getTopic()} Partition: ${context.getPartition()}`,
    );

    await this.antiFraudService.process(data);
  }
}
