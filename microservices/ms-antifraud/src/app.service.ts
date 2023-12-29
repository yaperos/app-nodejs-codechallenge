import { Inject, Injectable, Logger } from '@nestjs/common';
import { StatusEnum, TransactionDto } from './models/Transaction.dto';
import { ClientKafka } from '@nestjs/microservices';
import { ValidationDto } from './models/validation.dto';

@Injectable()
export class AppService {
  logger = new Logger(AppService.name);

  constructor(
    @Inject('ANTIFRAUD_MICROSERVICE')
    private readonly antifraudClient: ClientKafka,
  ) {}

  processTransaction(transaction: TransactionDto) {
    this.logger.debug('Processing transaction with id ' + transaction.id);
    const status = this.validateTransaction(transaction);
    this.sendStatus(transaction.id, status);
  }

  validateTransaction(transaction: TransactionDto): StatusEnum {
    this.logger.debug('Validating transaction');
    return transaction.value > 1000 ? StatusEnum.REJECTED : StatusEnum.APPROVED;
  }

  sendStatus(id: string, status: StatusEnum) {
    const validation: ValidationDto = {
      id: id,
      status: status,
    };
    this.antifraudClient.emit(
      process.env.KAFKA_VALIDATIONS_TOPIC
        ? process.env.KAFKA_VALIDATIONS_TOPIC
        : 'validations-topic',
      JSON.stringify(validation),
    );
  }
}
