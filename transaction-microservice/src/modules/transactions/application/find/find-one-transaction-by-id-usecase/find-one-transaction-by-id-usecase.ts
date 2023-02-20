import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { EitherAsync } from 'purify-ts';
import { eitherFromParseResult } from '../../../../../core/domain/errors';
import { TransactionRepository } from '../../../domain/repositories';
import {
    FindOneTransactionByIdUseCaseInput,
    FindOneTransactionByIdUseCaseInputType,
    FindOneTransactionByIdUseCaseOutputType,
} from './find-one-transaction-by-id-usecase.type';

@Injectable()
export class FindOneTransactionByIdUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}
  execute(
    input: FindOneTransactionByIdUseCaseInputType,
  ): EitherAsync<HttpException, FindOneTransactionByIdUseCaseOutputType> {
    return EitherAsync.liftEither(
      eitherFromParseResult(
        FindOneTransactionByIdUseCaseInput.safeParse(input),
      ),
    )
      .chain((parsed) =>
        this.transactionRepository.findOneTransactionById(parsed),
      );
  }
}
