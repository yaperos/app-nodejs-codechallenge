import { Controller, Logger } from '@nestjs/common';

import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { HealthcheckService } from '../../../application/services/healthcheck.service';

interface MessageDto {
  message: string;
}

@Controller()
export class HealthcheckListener {
  private readonly logger: Logger = new Logger(HealthcheckListener.name);
  constructor(private readonly antifraudMsService: HealthcheckService) {}

  @EventPattern('healthcheck')
  handler(@Payload() data: MessageDto, @Ctx() context: KafkaContext): void {
    this.logger.log(context.getTopic(), JSON.stringify(data));
    return this.antifraudMsService.printMessage(data.message);
  }
}
