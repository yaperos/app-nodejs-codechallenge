import { Controller } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { LoggerService } from '../shared/logger/logger.service';
import { TransactionStatusIdsEnum } from '../transaction-status/constants/transaction-status-ids.enum';
import { EventsEnum } from 'shared-library-challenge/build/events/EventsEnum';
import { TransactionApprovedEvent } from 'shared-library-challenge/build/events/TransactionApprovedEvent';
import { TransactionRejectedEvent } from 'shared-library-challenge/build/events/TransactionRejectedEvent';
import { Consumer } from '../shared/event/Consumer';

@Controller()
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly logger: LoggerService,
    private readonly consumer: Consumer,
  ) {}

  @EventPattern(EventsEnum.transactionApproved)
  async transactionApproved(
    @Payload() message: TransactionApprovedEvent,
    @Ctx() context: KafkaContext,
  ) {
    try {
      await this.transactionService.updateStatusTransaction(
        message.data.transaction_external_id,
        TransactionStatusIdsEnum.approvedId,
      );
      this.logger.log({
        function: 'transactionApproved',
        layer: 'transaction.controller',
        msg:
          'Se confirma aprobacion de tansaccion ' +
          message.data.transaction_external_id,
      });
      await this.consumer.commitOffset(context);
    } catch (e) {
      console.log(e);

      this.logger.error({
        function: 'transactionApproved',
        layer: 'transaction.controller',
        msg:
          'Ocurrio error al confirmar aprobacion de tansaccion ' +
          message.data.transaction_external_id,
        e,
      });
      throw e;
    }
  }

  @EventPattern(EventsEnum.transactionRejected)
  async transactionRejected(
    @Payload() message: TransactionRejectedEvent,
    @Ctx() context: KafkaContext,
  ) {
    try {
      await this.transactionService.updateStatusTransaction(
        message.data.transaction_external_id,
        TransactionStatusIdsEnum.rejectedId,
      );
      this.logger.log({
        function: 'transactionRejected',
        layer: 'transaction.controller',
        msg:
          'Se confirma rechazo de transaccion ' +
          message.data.transaction_external_id,
      });
      await this.consumer.commitOffset(context);
    } catch (e) {
      this.logger.error({
        function: 'transactionRejected',
        layer: 'transaction.controller',
        msg:
          'Ocurrio un error al confirma rechazo de tansaccion ' +
          message.data.transaction_external_id,
        e,
      });
      throw e;
    }
  }
}
