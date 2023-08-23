import { HttpException, Inject, NotFoundException } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionVerifyRepository } from 'src/module/domain/repositories/transaction-verify.repository';
import { TransactionVerifyInfrastructure } from 'src/module/infrastructure/transacion-verify.infrastructure';
import { SaveTransactionVerifyDto } from '../dto/save-transaction-verify.dto';
import { TransactionGenericApiResponse } from 'src/core/helpers/generic-response';

export class GetTransactionVerifyEventCommand implements IQuery {
  constructor(readonly transactionExternalId: string) {}
}

@QueryHandler(GetTransactionVerifyEventCommand)
export class GetTransactionVerifyEventCommandHandler
  implements
    IQueryHandler<
      GetTransactionVerifyEventCommand,
      TransactionGenericApiResponse
    >
{
  constructor(
    @Inject(TransactionVerifyInfrastructure)
    private readonly repository: TransactionVerifyRepository,
  ) {}

  async execute(
    command: GetTransactionVerifyEventCommand,
  ): Promise<TransactionGenericApiResponse> {
    try {
      const { transactionExternalId } = command;

      const transactionVerifyResult =
        await this.repository.findTransactionVerifyById(transactionExternalId);

      const response = SaveTransactionVerifyDto.fromDomainToResponse(
        transactionVerifyResult,
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
