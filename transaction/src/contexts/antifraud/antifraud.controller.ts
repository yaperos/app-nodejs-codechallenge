import { Controller } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { LoggerService } from '@/config/logger/logger.service';
import { TracerService } from '@/config/tracer/tracer.service';
import { Ctx, KafkaContext } from "@nestjs/microservices";
import { KafkaTopic } from '@/config/decorator/KafkaTopic';
import { TransactionDto } from '@/contexts/transaction/dto/transaction.dto';
import { HeadersDto } from '@/contexts/transaction/dto/headers.dto';

@Controller()
export class AntifraudController {
  constructor(
    private antifraudService: AntifraudService,
    private logger: LoggerService,
    private tracer: TracerService,
  ) {}

  @KafkaTopic('ANTI_FRAUD_KAFKA_TOPIC')
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
      'received event to persist a new anti fraud status',
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
