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
        msg: 'Se recibe transaccion ' + message.data.id_transaction,
      });
      if (this.antiFraudService.transactionMustBeApproved(message.data.value)) {
        await this.eventBus.emit(
          new TransactionApprovedEvent({
            id_transaction: message.data.id_transaction,
          }),
        );
        this.logger.log({
          function: 'transactionCreated',
          layer: 'anti-fraud.controller',
          msg: 'Se aprueba transaccion ' + message.data.id_transaction,
        });
      } else {
        await this.eventBus.emit(
          new TransactionRejectedEvent({
            id_transaction: message.data.id_transaction,
          }),
        );
        this.logger.log({
          function: 'transactionCreated',
          layer: 'anti-fraud.controller',
          msg: 'Se rechaza transaccion ' + message.data.id_transaction,
        });
      }
      await this.consumer.commitOffset(context);
    } catch (e) {
      this.logger.error({
        msg:
          'ocurrió error al procesar transaccion:  ' +
          message.data.id_transaction,
        stack: e.trace,
      });
    }
  }
}
