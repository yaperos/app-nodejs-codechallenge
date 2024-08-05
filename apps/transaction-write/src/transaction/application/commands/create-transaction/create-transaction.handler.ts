import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './create-transaction.command';
import { ITransactionRepository } from '../../../domain/repositories/itransaction.repository';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { ITransactionTypeRepository } from '../../../domain/repositories/itransaction-type.repository';
import { TransactionStatus } from '../../../domain/entities/status.entity';
import { TransactionType } from '../../../domain/entities/transaction-type.entity';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { StatusType, StatusTypeLabels } from '@app/common';
import { CreateTransactionResponse } from '../../dtos/create-transaction-response.dto';
import { TransactionCreatedSagaEvent } from '../../saga/transaction-created-saga.event';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    @Inject('ITransactionRepository')
    private readonly iTransactionRepository: ITransactionRepository,
    @Inject('ITransactionTypeRepository')
    private readonly iTransactionTypeRepository: ITransactionTypeRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: CreateTransactionCommand,
  ): Promise<CreateTransactionResponse> {
    const { createTransactionRequest: createTransactionDto } = command;
    const type = await this.iTransactionTypeRepository.findById(
      createTransactionDto.tranferTypeId,
    );

    if (!type) {
      throw new Error('type not found');
    }

    const register = Transaction.create(
      uuidv4(),
      createTransactionDto.accountExternalIdDebit,
      createTransactionDto.accountExternalIdCredit,
      createTransactionDto.value,
      new TransactionStatus(
        StatusType.pending,
        StatusTypeLabels[StatusType.pending],
      ),
      new TransactionType(type.getId(), type.getName()),
    );

    const resultTransaction =
      await this.iTransactionRepository.create(register);

    const event = new TransactionCreatedSagaEvent({
      transactionInternalId: resultTransaction.getId(),
      transactionExternalId: register.getTransactionExternalId(),
      accountExternalIdDebit: register.getAccountExternalIdDebit(),
      accountExternalIdCredit: register.getAccountExternalIdCredit(),
      value: register.getValue(),
      createdAt: resultTransaction.getCreatedAt(),
      transactionStatus: {
        id: register.getTransactionStatus().getId(),
        name: register.getTransactionStatus().getName(),
      },
      transactionType: {
        id: register.getTransactionType().getId(),
        name: register.getTransactionType().getName(),
      },
    });

    this.eventBus.publish(event);

    return {
      transactionExternalId: register.getTransactionExternalId(),
    };
  }
}
