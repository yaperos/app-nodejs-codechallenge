import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { TransactionCreatedDto } from './transaction-created.dto';
import { AfterCreateTransactionCommand } from '../../../application/commands/after-create-transaction.command';

@Controller()
export class TransactionCreatedListener {
  private readonly logger: Logger = new Logger(TransactionCreatedListener.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('transaction-created')
  async handler(
    @Payload() data: TransactionCreatedDto,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(context.getTopic(), JSON.stringify(data));
    const command = new AfterCreateTransactionCommand(JSON.stringify(data));
    await this.commandBus.execute(command);
  }
}
