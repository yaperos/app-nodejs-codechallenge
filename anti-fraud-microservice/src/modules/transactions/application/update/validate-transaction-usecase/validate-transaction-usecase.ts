import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { Either, Left } from 'purify-ts';
import { eitherFromParseResult } from '../../../../../core/domain/errors';
import {
  ValidateTransactionUseCaseInput,
  ValidateTransactionUseCaseInputType,
} from './validate-transaction-usecase.type';

@Injectable()
export class ValidateTransactionUseCase {
  //constructor(private readonly eventClientService: EventClientService) {}
  execute(
    input: ValidateTransactionUseCaseInputType,
  ): Either<HttpException, any> {
    return eitherFromParseResult(
      ValidateTransactionUseCaseInput.safeParse(input),
    ).chainLeft((e) =>
      Either.encase(() => {
        try {
          console.log('e: ', e.getResponse());
          return;
        } catch (error) {
          return Left(new InternalServerErrorException(error));
        }
      }),
    );
  }
}
