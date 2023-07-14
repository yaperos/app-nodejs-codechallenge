import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { TransactionUpdatedDto } from './transaction-updated.dto';
import { AfterUpdateTransactionCommand } from '../../../application/commands/after-update-trasaction.command';

@Controller()
export class TransactionUpdatedListener {
  private readonly logger: Logger = new Logger(TransactionUpdatedListener.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('transaction-updated')
  handler(
    @Payload() data: TransactionUpdatedDto,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(context.getTopic(), JSON.stringify(data));
    const command = new AfterUpdateTransactionCommand(JSON.stringify(data));
    this.commandBus.execute(command);
  }
}
