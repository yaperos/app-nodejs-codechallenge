import { HttpException, Inject, NotFoundException } from '@nestjs/common';
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { TransactionVerifyRepository } from 'src/module/domain/repositories/transaction-verify.repository';
import { TransactionVerifyInfrastructure } from 'src/module/infrastructure/transacion-verify.infrastructure';
import { TransactionVerifyUpdateRequest } from 'src/module/domain/entities/transaction-verify-request';

export class UpdateTransactionVerifyEventCommand implements ICommand {
  constructor(
    readonly transactionVerifyRequest: TransactionVerifyUpdateRequest,
  ) {}
}

@CommandHandler(UpdateTransactionVerifyEventCommand)
export class UpdateTransactionVerifyEventCommandHandler
  implements ICommandHandler<UpdateTransactionVerifyEventCommand, void>
{
  constructor(
    @Inject(TransactionVerifyInfrastructure)
    private readonly repository: TransactionVerifyRepository,
  ) {}

  async execute(command: UpdateTransactionVerifyEventCommand): Promise<void> {
    try {
      const { transactionVerifyRequest } = command;
      return await this.repository.updateTransactionVerify(
        transactionVerifyRequest,
      );
    } catch (error) {
      throw new NotFoundException(
        HttpException.createBody(error.message, error.name, error.status),
        error.status,
      );
    }
  }
}
