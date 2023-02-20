import { HttpException, Injectable } from '@nestjs/common';
import { EitherAsync } from 'purify-ts';
import { envConstants } from '../../../../../core/domain/constants';
import { eitherFromParseResult } from '../../../../../core/domain/errors';
import {
  TransactionRepository,
  TransactionTypeRepository
} from '../../../domain/repositories';
import { EventClientService } from '../../../domain/services';
import {
  RegisterTransactionUseCaseInput,
  RegisterTransactionUseCaseInputType,
  RegisterTransactionUseCaseOutputType
} from './register-transaction-usecase.type';

@Injectable()
export class RegisterTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionTypeRepository: TransactionTypeRepository,
    private readonly eventClientService: EventClientService,
  ) {}

  execute(
    input: RegisterTransactionUseCaseInputType,
  ): EitherAsync<HttpException, RegisterTransactionUseCaseOutputType> {
    return EitherAsync.liftEither(
      eitherFromParseResult(RegisterTransactionUseCaseInput.safeParse(input)),
    )
      .chain((parsed) =>
        this.transactionTypeRepository
          .findOneTransactionTypeById({ id: parsed.transferTypeId })
          .chain(() => this.transactionRepository.registerTransaction(parsed)),
      )
      .chain((transaction) => {
        return EitherAsync(async () => {
          this.eventClientService.emitEvent(
            envConstants.EVENT_NAME_VALIDATE_TRANSACTION,
            transaction,
          );
          return transaction;
        });
      });
  }
}
