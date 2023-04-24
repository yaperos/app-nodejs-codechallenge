import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { KafkaService } from '../../config/bus/kafka/kafka.service';
import { LoggerService } from '../../config/logger/logger.service';
import { TracerService } from '../../config/tracer/tracer.service';
import { HeadersDto } from './dto/headers.dto';
import { TransactionDto } from './dto/transaction.dto';
import { CreateAntiFraud } from './events/create.antiFraud';
import { INFO_RESPONSES } from '../../config/constants/response';

@Injectable()
export class AntifraudService {
  constructor(
    private logger: LoggerService,
    private tracer: TracerService,
    private kafkaService: KafkaService,
  ) {}
  async create(body: TransactionDto, headers: HeadersDto) {

    try {

      const transactionStatus= new CreateAntiFraud(body, {
        eventId: this.tracer.getTrace(),
        entityId: headers.entityId,
        commerce: headers.commerce,
        eventType: body.value <= 1000 ? 'approved' : 'rejected',
        channel: headers.channel
      });
      await this.kafkaService.emit(transactionStatus);

      const response = {
        message: `${INFO_RESPONSES.REQUEST_ACCEPTED.MESSAGE} : ${this.tracer.getTrace()}`,
      };

      this.logger.log(
        {
          layer: 'AntiFraudService',
          function: 'create',
          eventId: this.tracer.getTrace(),
          entityId: headers.entityId,
          response,
        },
        'Response',
      );
      return response;
    } catch (error) {
      const response = {
        message:
          (error?.message || 'error publishing to kafka') +
          `, eventId: ${this.tracer.getTrace()}`,
      };
      this.logger.error(
        {
          layer: 'AntiFraudService',
          function: 'create',
          eventId: this.tracer.getTrace(),
          entityId: headers.entityId,
          request: { headers, body },
          response,

        },
        'Error publishing to Kafka',
      );
      throw new InternalServerErrorException(response);
    }
  }
}
