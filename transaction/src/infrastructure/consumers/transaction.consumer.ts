import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AntiFraudDto } from '../../api/dto/update-status-transaction.param.dto';
import { UpdateStatusTransactionCommand } from '../../application/update-status-transaction/update-status-transaction.command';
import { TOPIC_KAFKA_RECIVE_STATUS_TRANSACTION } from '../constants';

@Controller()
export class TransactionConsumer {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(TOPIC_KAFKA_RECIVE_STATUS_TRANSACTION)
  public consume(@Payload() payload: AntiFraudDto): any {
    console.log('TRANSACTION: TransactionConsumer/client -- message', JSON.stringify(payload));
    const command: UpdateStatusTransactionCommand = new UpdateStatusTransactionCommand(
      payload.value.data.id,
      payload.value.data.transactionStatus,
      payload.value.data.value,
    );
    this.commandBus.execute(command);
  }
}
