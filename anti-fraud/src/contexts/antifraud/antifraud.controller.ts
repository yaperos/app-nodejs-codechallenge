import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { TransactionDto } from './dto/transaction.dto';
import { AntifraudService } from './antifraud.service';
import { LoggerService } from '../../config/logger/logger.service';
import { TracerService } from '../../config/tracer/tracer.service';
import { HeadersDto } from './dto/headers.dto';
import { Ctx, KafkaContext } from "@nestjs/microservices";
import { KafkaTopic } from "../../config/decorator/KafkaTopic";

@Controller()
export class AntifraudController {
  constructor(
    private antifraudService: AntifraudService,
    private logger: LoggerService,
    private tracer: TracerService,
  ) {}

  @KafkaTopic('TRANSACTION_KAFKA_TOPIC')
  async post(@Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const headers = originalMessage?.headers as unknown as HeadersDto;
    const value = originalMessage?.value as unknown as TransactionDto;
    if (headers?.eventId) {
      this.tracer.setTrace(headers.eventId);
    }
    this.logger.log(
      {
        layer: 'AntifraudController',
        function: 'post',
        eventId: this.tracer.getTrace(),
        entityId: headers.entityId,
        transaction: { originalMessage },
      },
      'received event transaction to publish a new antifraud',
    );

    try {
       await this.antifraudService.create(value, headers);
    } catch (error) {
      this.logger.error(
         {
            layer: 'AntifraudController',
            function: 'post',
            eventId: headers?.eventId,
            entityId: headers.entityId,
            serviceError: error,
         },
         error?.message || 'An unexpected error has occurred',
        );
    }
  }
}
