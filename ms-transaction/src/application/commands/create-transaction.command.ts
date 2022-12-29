import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { TransactionInfrastructure } from '../../infrastructure/transaction.infrastructure';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { Inject } from '@nestjs/common';
import { Transaction } from '../../domain/aggregates/transaction';
import { ClientKafka } from '@nestjs/microservices';
import {TransactionResponseDto} from "../dtos/transaction-response.dto";

export class CreateTransactionCommand implements ICommand {
  constructor(
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly tranferTypeId: number,
    public readonly value: number,
  ) {}
}

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionCommandHandler
  implements ICommandHandler<CreateTransactionCommand, TransactionResponseDto>
{
  constructor(
    @Inject(TransactionInfrastructure)
    private repository: TransactionRepository,
    @Inject('TRANSACTION_EMITTER') private readonly authClient: ClientKafka,
  ) {}

  async execute(
    command: CreateTransactionCommand,
  ): Promise<TransactionResponseDto> {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    } = command;

    const transaction = new Transaction({
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    });

    const transactionSaved = await this.repository.save(transaction);
    this.authClient.emit(
      'verify-transaction',
      JSON.stringify({
        transactionExternalId:
          transactionSaved.properties().transactionExternalId,
        value: transactionSaved.properties().value,
      }),
    );
    return TransactionResponseDto.fromDomainToResponse(transactionSaved);
  }
}
