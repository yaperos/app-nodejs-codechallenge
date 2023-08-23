import { HttpException, Inject, NotFoundException } from '@nestjs/common';
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { AntiFraudValidationRepository } from 'src/module/domain/repositories/anti-fraud-validation-repository';
import { TransactionVerify } from 'src/module/domain/entities/transaction-verify';
import { AntiFraudValidationInfrastructure } from 'src/module/infrastructure/anti-fraud-validation.infrastructure';
import { Observable } from 'rxjs';

export class GetAntiFraudValidationEventCommand implements ICommand {
  constructor(readonly transactionExternalId: string, readonly value: number) {}
}

@CommandHandler(GetAntiFraudValidationEventCommand)
export class GetAntiFraudValidationEventCommandHandler
  implements ICommandHandler<GetAntiFraudValidationEventCommand>
{
  constructor(
    @Inject(AntiFraudValidationInfrastructure)
    private readonly repository: AntiFraudValidationRepository,
  ) {}

  async execute(
    command: GetAntiFraudValidationEventCommand,
  ): Promise<Observable<unknown>> {
    try {
      const { transactionExternalId, value } = command;
      const transactionVerify: TransactionVerify = {
        transactionExternalId,
        value,
      };
      return await this.repository.getVerifyTransaction(transactionVerify);
    } catch (error) {
      throw new NotFoundException(
        HttpException.createBody(error.message, error.name, error.status),
        error.status,
      );
    }
  }
}
