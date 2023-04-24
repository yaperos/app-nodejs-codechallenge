import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { KafkaService } from '@/config/bus/kafka/kafka.service';
import { LoggerService } from '@/config/logger/logger.service';
import { TracerService } from '@/config/tracer/tracer.service';
import { HeadersDto } from './dto/headers.dto';
import { TransactionDto } from './dto/transaction.dto';
import { CreateTransaction } from './events/create.transaction';
import { INFO_RESPONSES } from '@/config/constants/response';
import { TransactionRepository } from '@/contexts/transaction/transaction.repository';
import { Transaction } from '@/contexts/transaction/entities/transaction.entity';
import { transactionBuilder } from '@/contexts/transaction/transaction.builder';
import { TYPES } from '@/config/constants/types';

@Injectable()
export class TransactionService {
  constructor(
    private logger: LoggerService,
    private tracer: TracerService,
    private kafkaService: KafkaService,
    private readonly transactionRepository: TransactionRepository,
  ) {}
  async create(body: TransactionDto, headers: HeadersDto) {
    const entityId = body.accountExternalIdCredit;
    try {

      const transactionEntity = new Transaction({
        transaction_id: this.tracer.getTrace(),
        account_external_id_debit: body.accountExternalIdDebit,
        account_external_id_credit: body.accountExternalIdCredit,
        transaction_type: TYPES[body.transferTypeId],
        transaction_status: 'PENDING',
        value: body.value,
      })

      await this.transactionRepository.insertData(transactionEntity)

      const createTransactionEvent = new CreateTransaction(body, {
        eventId: this.tracer.getTrace(),
        entityId,
        commerce: headers.commerce,
        channel: headers.channel,
      });
      await this.kafkaService.emit(createTransactionEvent);

      const response = {
        message: `${INFO_RESPONSES.REQUEST_ACCEPTED.MESSAGE} : ${this.tracer.getTrace()}`,
      };

      this.logger.log(
        {
          layer: 'TransactionService',
          function: 'create',
          eventId: this.tracer.getTrace(),
          entityId,
          body: response,
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
          layer: 'TransactionService',
          function: 'create',
          eventId: this.tracer.getTrace(),
          entityId,
          request: { body },
          response,

        },
        'Error publishing to Kafka',
      );
      throw new InternalServerErrorException(response);
    }
  }

  async find(id: string, res) {
    try {

      const transactionData = await this.transactionRepository.findData(id)

      const response = transactionData.map(r => transactionBuilder(r))

      if(response.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json(response)
      }

      this.logger.log(
        {
          layer: 'TransactionService',
          function: 'find',
          eventId: this.tracer.getTrace(),
          body: response,
        },
        'Response',
      );
      return res.status(HttpStatus.OK).json(response)

    } catch (error) {
      const response = {
        message:
          (error?.message +
          `, eventId: ${this.tracer.getTrace()}`),
      };
      this.logger.error(
        {
          layer: 'transactionService',
          function: 'find',
          eventId: this.tracer.getTrace(),
          response,
        },
        'Error in find transaction',
      );
      throw new InternalServerErrorException(response);
    }
  }
}
