import { Controller, Inject } from '@nestjs/common';
import { AntiFraudeService } from './anti-fraude.service';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { Transaction } from '../interfaz/transaction.interfaz';
import { updatedTransactionEvent } from '../utils/createdTransactionEvent';
import {
  TRANSACTION_CREATED,
  UPDATED_TRANSACTION_STATUS_TOPIC,
} from '../constants/commons';

@Controller()
export class AntiFraudeController {
  constructor(
    private readonly antiFraudeService: AntiFraudeService,
    @Inject('TRANSACTION_SERVICE')
    private readonly tranasctionClient: ClientKafka,
  ) {}

  @EventPattern(TRANSACTION_CREATED)
  handleUpdatedTransactionStatus(payload: Transaction) {
    this.tranasctionClient.emit(
      UPDATED_TRANSACTION_STATUS_TOPIC,
      updatedTransactionEvent(payload),
    );
  }
}
