import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ValidateTransactionCommand } from 'src/application/validate-transaction/validate-transaction.command';
import { AntiFraudDto } from '../../api/dto/read-transaction.param.dto';
import { TOPIC_KAFKA_SEND_TRANSACTION } from '../constants';

@Controller()
export class TransactionConsumer {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(TOPIC_KAFKA_SEND_TRANSACTION)
  public consume(@Payload() payload: AntiFraudDto): any {
    console.log('ANTI-FRAUD: TransactionConsumer/client -- message', JSON.stringify(payload));
    const command: ValidateTransactionCommand = new ValidateTransactionCommand(
      payload.value.data.id,
      payload.value.data.transactionStatus,
      payload.value.data.value,
    );
    this.commandBus.execute(command);
  }
}
