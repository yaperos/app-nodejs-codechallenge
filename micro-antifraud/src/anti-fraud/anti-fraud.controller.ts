import { Controller, Injectable } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { Producer } from '../shared/event/Producer';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionCreatedEvent } from '../transaction/events/transaction-created.event';
import { TransactionApprovedEvent } from './events/TransactionApprovedEvent';
import { TransactionRejectedEvent } from './events/TransactionRejectedEvent';
import { LoggerService } from '../shared/logger/logger.service';

@Controller()
export class AntiFraudController {
  constructor(
    private readonly antiFraudService: AntiFraudService,
    private readonly eventBus: Producer,
    private readonly logger: LoggerService,
  ) {}

  @EventPattern('transactionCreated')
  async transactionCreated(@Payload() message: TransactionCreatedEvent) {
    try {
      this.logger.log({
        function: 'transactionCreated',
        layer: 'anti-fraud.controller',
        msg: 'Se recibe tansaccion ' + message.data.id_transaction,
      });
      if (this.antiFraudService.transactionMustBeApproved(message.data)) {
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
