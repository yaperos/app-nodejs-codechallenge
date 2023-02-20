import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { Either } from 'purify-ts';
import { EventClientService } from '../../../domain/services';
import { ZTransactionStatus } from '../../../domain/types';
import { eitherFromParseResult } from '../../../../../core/domain/errors';
import {
  ValidateTransactionUseCaseInput,
  ValidateTransactionUseCaseInputType
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
    return this.eventClientService.emitEvent('validated-transaction', response);
  }
}
