import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { LoggerService } from '../infraestructure/logger/logger.service';
import { ShowTransactionDto } from './dto/show-transaction.dto';

export enum IStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

@Injectable()
export class AntiFraudService {
  private context = 'AntiFraudService';

  constructor(
    @Inject('YAPE_EVENT_BUS')
    private readonly eventClient: ClientKafka,
    private readonly logger: LoggerService,
  ) { }


  validate(transaction: ShowTransactionDto): void {
    const context = `${this.context}-validate`;
    this.logger.log(context, 'start', {
      CreateTransactionDto: transaction,
    });

    let status = IStatus.APPROVED;

    if (transaction.value > 1000) {
      status = IStatus.REJECTED;
    }
    this.eventClient.emit('update-transaction', {
      transactionExternalId: transaction.transactionExternalId,
      statusId: status,
    });
  }
}
