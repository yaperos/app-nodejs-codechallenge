import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { LoggerService } from '../infraestructure/logger/logger.service';
import { ShowTransactionDto } from './dto/show-transaction.dto';
import { EvaluationResultDto } from './result-anti-fraud.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AntiFraudService {
  private context = 'AntiFraudService';

  constructor(
    @Inject('YAPE_EVENT_BUS')
    private readonly eventClient: ClientKafka,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  validate(transaction: ShowTransactionDto): EvaluationResultDto {
    const context = `${this.context}-validate`;
    this.logger.log(context, 'start', {
      CreateTransactionDto: transaction,
    });

    let evaluationResultDto: EvaluationResultDto = {
      transactionExternalId: transaction.transactionExternalId,
      result: 'approved',
    };

    if (
      transaction.value >
      this.configService.get<number>('MAXIMUM_ALLOWED_VALUE')
    ) {
      evaluationResultDto = {
        ...evaluationResultDto,
        result: 'rejected',
      };
    }

    this.eventClient.emit('update-transaction', evaluationResultDto);
    return evaluationResultDto;
  }
}
