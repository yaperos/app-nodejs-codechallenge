import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateTransactionStatusCommand } from 'src/application/commands/update-transaction-status.command';
import { TransactionStatus } from 'src/domain/models';

@Controller()
export class KafkaServerController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern('transaction.approved')
  handleTransactionApproved(@Payload() message: { transactionId: string }) {
    this.commandBus.execute(
      new UpdateTransactionStatusCommand(
        message.transactionId,
        TransactionStatus.APPROVED,
      ),
    );
  }

  @MessagePattern('transaction.rejected')
  handleTransactionRejected(@Payload() message: { transactionId: string }) {
    this.commandBus.execute(
      new UpdateTransactionStatusCommand(
        message.transactionId,
        TransactionStatus.REJECTED,
      ),
    );
  }
}
