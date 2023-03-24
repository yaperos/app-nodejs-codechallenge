import { Inject, Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './dto/transaction-created.dto';
import { GeneralResponse } from './dto/general-response.dto';
import { AppRepository } from './app.repository';
import { MessagesResponses } from './util/message.util';
import { CodeResponses, Status } from './util/const.util';

@Injectable()
export class AppService {
  constructor(
    private readonly appRepository: AppRepository
  ) {}

  async handleTransactionCreated(transactionCreatedEvent: TransactionCreatedEvent) {
    const status = (transactionCreatedEvent.value > 1000)?Status.REJECTED:Status.APROVED;
    const updateTransactionStatus = await this.appRepository.updateTransactionStatus(transactionCreatedEvent.transactionId,status);
    const message = transactionCreatedEvent.transactionId+ MessagesResponses.UPDATE_TRANSACTION_STATUS+ status;
    return new GeneralResponse(message,CodeResponses.OK,updateTransactionStatus);
  }
}
