import {
  CLIENT_ANTI_FRAUD_NAME,
  MessageTransactionDto,
  TRANSACTION_EVENT_ID,
  TRANSACTION_STATUS,
} from '@app/core-library';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MsAntiFraudService {
  private readonly logger = new Logger(MsAntiFraudService.name);
  private readonly MaxValueRule: number;
  constructor(
    @Inject(CLIENT_ANTI_FRAUD_NAME)
    private readonly kafkaClient: ClientKafka,
    private readonly configService: ConfigService,
  ) {
    this.MaxValueRule = this.configService.get<number>(
      'MAX_AMOUNT_VALUE',
      1000,
    );
  }
  async validateAmount(
    messageTransactionDto: MessageTransactionDto,
  ): Promise<void> {
    this.logger.log('-- init validateAmount --');
    this.logger.log(JSON.stringify(messageTransactionDto));
    const { value, transactionExternalId } = messageTransactionDto;
    let transactionStatusId = 0;
    if (value > this.MaxValueRule)
      transactionStatusId = TRANSACTION_STATUS.REJECTED;
    else transactionStatusId = TRANSACTION_STATUS.APPROVED;

    const message = new MessageTransactionDto(
      transactionExternalId,
      transactionStatusId,
      value,
    ).toString();

    this.logger.log('-- kafka message --');
    this.logger.log(message);

    this.kafkaClient.emit(TRANSACTION_EVENT_ID.UPDATE, message);
  }
}
