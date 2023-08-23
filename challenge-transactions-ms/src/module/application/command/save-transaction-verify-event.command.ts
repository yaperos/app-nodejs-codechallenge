import { HttpException, Inject, NotFoundException } from '@nestjs/common';
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { TransactionVerifyRepository } from 'src/module/domain/repositories/transaction-verify.repository';
import { TransactionVerifyInfrastructure } from 'src/module/infrastructure/transacion-verify.infrastructure';
import { TransactionVerifyRequest } from 'src/module/domain/entities/transaction-verify-request';
import { SaveTransactionVerifyDto } from '../dto/save-transaction-verify.dto';
import { TransactionGenericApiResponse } from 'src/core/helpers/generic-response';

export class SaveTransactionVerifyEventCommand implements ICommand {
  constructor(readonly transactionVerifyRequest: TransactionVerifyRequest) {}
}

@CommandHandler(SaveTransactionVerifyEventCommand)
export class SaveTransactionVerifyCommandHandler
  implements
    ICommandHandler<
      SaveTransactionVerifyEventCommand,
      TransactionGenericApiResponse
    >
{
  constructor(
    @Inject(TransactionVerifyInfrastructure)
    private readonly repository: TransactionVerifyRepository,
  ) {}

  async execute(
    command: SaveTransactionVerifyEventCommand,
  ): Promise<TransactionGenericApiResponse> {
    try {
      const { transactionVerifyRequest } = command;

      const transactionVerifyResultSaved =
        await this.repository.saveTransactionVerify(transactionVerifyRequest);

      // EMIT TO VERIFY ANTI FRAUD
      await this.repository.emitterToValidateAntiFraud({
        transactionExternalId:
          transactionVerifyResultSaved.transactionExternalId,
        value: transactionVerifyResultSaved.value,
      });

      const response = SaveTransactionVerifyDto.fromDomainToResponse(
        transactionVerifyResultSaved,
      );

      return new TransactionGenericApiResponse(response);
    } catch (error) {
      throw new NotFoundException(
        HttpException.createBody(error.message, error.name, error.status),
        error.status,
      );
    }
  }
}
