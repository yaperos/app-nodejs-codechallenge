import { Controller } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { Producer } from '../shared/event/Producer';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { LoggerService } from '../shared/logger/logger.service';
import { EventsEnum } from 'shared-library-challenge/build/events/EventsEnum';
import { TransactionCreatedEvent } from 'shared-library-challenge/build/events/transaction-created.event';
import { TransactionApprovedEvent } from 'shared-library-challenge/build/events/TransactionApprovedEvent';
import { TransactionRejectedEvent } from 'shared-library-challenge/build/events/TransactionRejectedEvent';
import { Consumer } from '../shared/event/Consumer';

@Controller()
export class AntiFraudController {
  constructor(
    private readonly antiFraudService: AntiFraudService,
    private readonly eventBus: Producer,
    private readonly logger: LoggerService,
    private readonly consumer: Consumer,
  ) {}

  @EventPattern(EventsEnum.transactionCreated)
  async transactionCreated(
    @Payload() message: TransactionCreatedEvent,
    @Ctx() context: KafkaContext,
  ) {
    try {
      this.logger.log({
        function: 'transactionCreated',
        layer: 'anti-fraud.controller',
        msg: 'Se recibe transaccion ' + message.data.transaction_external_id,
      });
      if (this.antiFraudService.transactionMustBeApproved(message.data.value)) {
        await this.eventBus.emit(
          new TransactionApprovedEvent({
            transaction_external_id: message.data.transaction_external_id,
          }),
        );
        this.logger.log({
          function: 'transactionCreated',
          layer: 'anti-fraud.controller',
          msg: 'Se aprueba transaccion ' + message.data.transaction_external_id,
        });
      } else {
        await this.eventBus.emit(
          new TransactionRejectedEvent({
            transaction_external_id: message.data.transaction_external_id,
          }),
        );
        this.logger.log({
          function: 'transactionCreated',
          layer: 'anti-fraud.controller',
          msg: 'Se rechaza transaccion ' + message.data.transaction_external_id,
        });
      }
      await this.consumer.commitOffset(context);
    } catch (e) {
      this.logger.error({
        msg:
          'ocurrió error al procesar transaccion:  ' +
          message.data.transaction_external_id,
        stack: e.trace,
      });
    }
  }
}
