import { HttpException, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { ClientKafka } from '@nestjs/microservices';
import { EitherAsync } from 'purify-ts';
import { firstValueFrom } from 'rxjs';
import { envConstants } from 'src/core/domain/constants';
import { eitherFromParseResult } from '../../../../../core/domain/errors';
import {
  TransactionRepository,
  TransactionTypeRepository,
} from '../../../domain/repositories';
import {
  RegisterTransactionUseCaseInput,
  RegisterTransactionUseCaseInputType,
  RegisterTransactionUseCaseOutputType,
} from './register-transaction-usecase.type';

@Injectable()
export class RegisterTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionTypeRepository: TransactionTypeRepository,
    @Inject(envConstants.KAFKA_NAME_MODULE)
    private readonly transactionClient: ClientKafka,
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
          await firstValueFrom(
            this.transactionClient.emit(
              envConstants.EVENT_NAME_VALIDATE_TRANSACTION,
              JSON.stringify(transaction),
            ),
          );
          return transaction;
        });
      });
  }
}
