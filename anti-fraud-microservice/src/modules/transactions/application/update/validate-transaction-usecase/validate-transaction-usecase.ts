import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { env } from 'process';
import { Either } from 'purify-ts';
import { eitherFromParseResult } from '../../../../../core/domain/errors';
import { EventClientService } from '../../../domain/services';
import { ZTransactionStatus } from '../../../domain/types';
import {
  ValidateTransactionUseCaseInput,
  ValidateTransactionUseCaseInputType,
} from './validate-transaction-usecase.type';

@Injectable()
export class ValidateTransactionUseCase {
  constructor(private readonly eventClientService: EventClientService) {}
  execute(
    input: ValidateTransactionUseCaseInputType,
  ): Either<HttpException, void> {
    const parseInput = eitherFromParseResult(
      ValidateTransactionUseCaseInput.safeParse(input),
    );
    const status = parseInput.isRight()
      ? ZTransactionStatus.Enum.APPROVED
      : ZTransactionStatus.Enum.REJECTED;
    const response = {
      id: input.id,
      status: status,
    };
    return this.eventClientService.emitEvent(
      env.EVENT_NAME_TRANSACTION_VALIDATED,
      response,
    );
  }
}
