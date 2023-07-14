import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransferTypeRepository } from '../../domain/repositories/transfer-type.repository';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionCreatedEvent } from '../../domain/events/transaction-created.event';

export class CreateTransactionCommand implements ICommand {
  constructor(
    readonly accountExternalIdDebit: string,
    readonly accountExternalIdCredit: string,
    readonly transferTypeId: number,
    readonly value: number,
  ) {}
}

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionCommandHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  private readonly logger: Logger = new Logger(
    CreateTransactionCommandHandler.name,
  );

  constructor(
    @Inject('TransactionRepositoryImplement')
    private readonly transactionRepository: TransactionRepository,
    @Inject('TransferTypeRepositoryImplement')
    private readonly typeRepository: TransferTypeRepository,
    @Inject('ANTIFRAUD_SERVICE')
    private readonly clientKafka: ClientKafka,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<TransactionEntity> {
    const transferType = await this.typeRepository.findTransferType(
      command.transferTypeId,
    );

    if (transferType.isErr()) {
      this.logger.error(transferType.error.message);
      throw new InternalServerErrorException(
        transferType.error.message,
        transferType.error.name,
      );
    }

    const entity = TransactionEntity.create(
      command.accountExternalIdDebit,
      command.accountExternalIdCredit,
      command.value,
      transferType.value,
    );

    this.logger.log(JSON.stringify(entity));
    const created = await this.transactionRepository.createTransaction(entity);

    if (created.isErr()) {
      this.logger.error(created.error.message);
      throw new InternalServerErrorException(
        created.error.message,
        created.error.name,
      );
    }

    const event = new TransactionCreatedEvent(entity);
    this.clientKafka.emit(event.eventName, event.toString());
    this.logger.log(event.toString());
    return entity;
  }
}
