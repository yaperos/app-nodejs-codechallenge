import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/* Project */
import { ValidateTransactionCommand } from '../impl/validate-transaction.command';
import { KafkaService } from '../../../../common/kafka';
import { validateDTOClass } from '../../../../common/helpers';
import { TransactionRequestDto } from '../../dtos/transaction.dto';
import { TRANSACTION_ID_MISSING } from '../../../../common/constants/errors';

@CommandHandler(ValidateTransactionCommand)
export class ValidateTransactionHandler
  implements ICommandHandler<ValidateTransactionCommand>
{
  private readonly logger = new Logger(ValidateTransactionHandler.name);
  private readonly validatedTopic: string;

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly configService: ConfigService,
  ) {
    this.validatedTopic = this.configService.get<string>(
      'KAFKA_TRANSACTIONS_VALIDATED_TOPIC',
    )!;
  }

  async execute(command: ValidateTransactionCommand): Promise<void> {
    const { payload } = command;

    const result = await validateDTOClass(
      TransactionRequestDto,
      payload,
      'Invalid message',
    );

    if (result instanceof Error) {
      throw result;
    }

    const dto = result;

    const amount = dto.value;
    const transactionId = dto.id;

    if (!transactionId) {
      this.logger.warn('Received message without transaction.id');
      throw TRANSACTION_ID_MISSING;
    }

    const status = amount > 1000 ? 'rejected' : 'approved';

    const payloadOut = {
      transactionId,
      status,
    };

    await this.kafkaService.publishToTopic(
      this.validatedTopic,
      JSON.stringify(payloadOut),
    );

    this.logger.log(
      `✅ Published validation result to ${this.validatedTopic}: ${JSON.stringify(
        payloadOut,
      )}`,
    );
  }
}
