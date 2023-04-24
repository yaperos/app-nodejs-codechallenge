import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoggerService } from '@/config/logger/logger.service';
import { TracerService } from '@/config/tracer/tracer.service';
import { TransactionDto } from '@/contexts/transaction/dto/transaction.dto';
import { TransactionRepository } from '@/contexts/transaction/transaction.repository';
import { HeadersDto } from '@/contexts/transaction/dto/headers.dto';

@Injectable()
export class AntifraudService {
  constructor(
    private logger: LoggerService,
    private tracer: TracerService,
    private readonly transactionRepository: TransactionRepository,
  ) {}
  async create(body: TransactionDto, headers: HeadersDto) {

    try {

      const response = await this.transactionRepository.updateData(headers.eventId, headers.eventType)

      this.logger.log(
        {
          layer: 'AntiFraudService',
          function: 'create',
          eventId: this.tracer.getTrace(),
          entityId: headers.entityId,
          response,
        },
        'this transaction was updated',
      );
      return response;
    } catch (error) {
      this.logger.error(
        {
          layer: 'AntiFraudService',
          function: 'create',
          eventId: this.tracer.getTrace(),
          entityId: headers.entityId,
          error,
        },
        'occurred in error',
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
