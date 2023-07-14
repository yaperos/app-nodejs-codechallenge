import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { TransactionValidatedDto } from './transaction-validated.dto';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateTransactionCommand } from '../../../application/commands/update-trasaction.command';

@Controller()
export class TransactionValidatedListener {
  private readonly logger: Logger = new Logger(
    TransactionValidatedListener.name,
  );

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('transaction-validated')
  handler(
    @Payload() data: TransactionValidatedDto,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(context.getTopic(), JSON.stringify(data));
    const command = new UpdateTransactionCommand(
      data.transactionExternalId,
      data.transactionStatus,
    );
    this.commandBus.execute(command);
  }
}
