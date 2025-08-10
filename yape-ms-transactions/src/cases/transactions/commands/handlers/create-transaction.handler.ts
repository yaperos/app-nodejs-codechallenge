import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';

/* Extra */
import { v4 as uuid } from 'uuid';

/* Project */
import { CreateTransactionDto, TransactionResponseDto } from '../../dtos';
import { CreateTransactionCommand } from '../impl/create-transaction.command';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../repositories';
import { RetrieveTransactionTypeQuery } from '../../../transaction_types/queries';
import { TransactionType } from '../../../transaction_types/models';
import { validateDTOClass } from '../../../../common/helpers';
import { TRANSACTION_TYPE_NOT_FOUND } from '../../../../common/constants/errors';
import { KafkaService } from '../../../../common/kafka/kafka.service';
import { TransactionCreator } from '../../types';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  private readonly logger = new Logger(CreateTransactionHandler.name);
  private readonly TOPIC: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly queryBus: QueryBus,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    private readonly kafkaService: KafkaService,
  ) {
    this.TOPIC = this.configService.get('KAFKA_TRANSACTIONS_TOPIC')!;
  }

  async execute(
    command: CreateTransactionCommand,
  ): Promise<TransactionResponseDto> {
    const result = await validateDTOClass(
      CreateTransactionDto,
      command.payload,
      'Invalid transaction payload',
    );

    if (result instanceof Error) {
      throw result;
    }

    const dto = result;

    const transactionType = await this.queryBus.execute<
      RetrieveTransactionTypeQuery,
      TransactionType
    >(new RetrieveTransactionTypeQuery(dto.transferTypeId));

    if (!transactionType) {
      throw TRANSACTION_TYPE_NOT_FOUND;
    }

    const toSave: TransactionCreator = {
      id: uuid(),
      accountExternalIdDebit: dto.accountExternalIdDebit,
      accountExternalIdCredit: dto.accountExternalIdCredit,
      transferTypeId: dto.transferTypeId,
      value: String(dto.value),
    } as const;

    const newTransaction = await this.transactionRepository.save(toSave);

    this.logger.log(`Emitting new: ${this.TOPIC} for ${newTransaction.id}`);
    await this.kafkaService.publishToTopic(
      this.TOPIC,
      JSON.stringify(newTransaction),
    );

    return {
      transactionId: newTransaction.id,
      transactionType: { name: transactionType.name },
      transactionStatus: { name: newTransaction.transactionStatusName },
      value: Number(newTransaction.value),
      createdAt: newTransaction.createdAt.toISOString(),
    };
  }
}
