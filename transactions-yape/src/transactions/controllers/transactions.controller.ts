import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Controller()
export class TransactionsController {

  constructor(private readonly transactionsService: TransactionsService,
    private eventEmitter: EventEmitter2) {}

  @EventPattern('transactionsyape') 
  transactionEvent(@Payload() eventMessage) {
    Logger.debug(eventMessage, 'TransactionsController - transactionEvent');
    this.eventEmitter.emit(eventMessage.eventType, eventMessage);
  }

  @OnEvent('TransactionCreated')
  handleCreatedTransaction(createTransactionDto: CreateTransactionDto) {
    Logger.debug(createTransactionDto,
      'TransactionsController - handleCreatedTransaction');
    this.transactionsService.createTransaction(createTransactionDto);
  }

  /*
   The basis of the following operations is provided for possible future implementations
  */

  @OnEvent('TransactionUpdated')
  handleUpdatedEvent(updateTransactionDto: UpdateTransactionDto) {
    Logger.debug(
      updateTransactionDto,
      'TransactionsController - TransactionUpdated',
    );
  }

  @OnEvent('TransactionDeleted')
  handleServiceDeletedEvent(deleteServiceDto: any) {
    Logger.debug(
      deleteServiceDto,
      'TransactionsController - TransactionDeleted',
    );
  }

}
