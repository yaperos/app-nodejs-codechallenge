import { HttpException, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { ClientKafka } from '@nestjs/microservices';
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
  constructor(
    private readonly transactionRepository: TransactionRepository,
    @Inject('TRANSACTION_MICROSERVICE')
    private readonly transactionClient: ClientKafka,
  ) {}

  execute(
    input: RegisterTransactionUseCaseInputType,
  ): EitherAsync<HttpException, RegisterTransactionUseCaseOutputType> {
    return EitherAsync.liftEither(
      eitherFromParseResult(RegisterTransactionUseCaseInput.safeParse(input)),
    ).chain(async (parsed) => {
      this.transactionClient.emit('validate-transaction', parsed);
      return this.transactionRepository.registerTransaction(parsed);
    });
  }
}
