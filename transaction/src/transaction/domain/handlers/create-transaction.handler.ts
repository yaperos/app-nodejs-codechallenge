import { Logger } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';
import { CreateTransactionEvent } from './../events/create-transaction.event';

export class CreateTransactionHandler
  implements IEventHandler<CreateTransactionEvent>
{
  private readonly logger = new Logger(CreateTransactionHandler.name);
  handle(event: CreateTransactionEvent) {
    this.logger.log(`Transaction ${event.transaction.tranferTypeId} created`);
  }
}
