import { Injectable } from '@nestjs/common';
import { EitherAsync } from 'purify-ts';
import { eitherFromParseResult } from '../../../../../core/domain/errors';
import { TransactionRepository } from '../../../domain/repositories';
import {
  UpdateTransactionStatusUseCaseInput,
  UpdateTransactionStatusUseCaseInputType,
} from './update-transaction-status.type-usecase';

@Injectable()
export class UpdateTransactionStatusUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  execute(input: UpdateTransactionStatusUseCaseInputType) {
    return EitherAsync.liftEither(
      eitherFromParseResult(
        UpdateTransactionStatusUseCaseInput.safeParse(input),
      ),
    ).chain((parsed) =>
      this.transactionRepository.updateTransactionStatus(parsed),
    );
  }
}
