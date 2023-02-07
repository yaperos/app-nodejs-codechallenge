import { HttpException, Injectable } from '@nestjs/common';
import { EitherAsync } from 'purify-ts';
import { eitherFromParseResult } from '../../../../../core/domain/errors';
import { TransactionRepository } from '../../../domain/repositories';
import {
  RegisterTransactionUseCaseInput,
  RegisterTransactionUseCaseInputType,
  RegisterTransactionUseCaseOutputType,
} from './register-transaction-usecase.type';

@Injectable()
export class RegisterTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  execute(
    input: RegisterTransactionUseCaseInputType,
  ): EitherAsync<HttpException, RegisterTransactionUseCaseOutputType> {
    return EitherAsync.liftEither(
      eitherFromParseResult(RegisterTransactionUseCaseInput.safeParse(input)),
    ).chain((parsed) => this.transactionRepository.registerTransaction(parsed));
  }
}
