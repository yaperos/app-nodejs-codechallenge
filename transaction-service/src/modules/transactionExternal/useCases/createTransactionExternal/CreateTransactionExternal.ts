/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppError,
  DomainEvents,
  Either,
  Result,
  UniqueEntityID,
  UseCase,
  left,
  right,
} from 'clean-common-lib';
import { CreateTransactionExternalErrors } from './CreateTransactionExternalErrors';
import { ITransactionRepo } from '../../repositories/transactionRepo';
import { TransactionExternalDTO } from './CreateTransactionExternalDTO';
import { Guid, TransactionExternal, TransactionValue } from '../../domain';

type Response = Either<
  | CreateTransactionExternalErrors.AccountExternalDoNotExists
  | CreateTransactionExternalErrors.InvalidTransactionExternalAmount
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export class CreateTransactionExternal
  implements UseCase<TransactionExternalDTO, Promise<Response>>
{
  private transactionRepo: ITransactionRepo;

  constructor(transactionRepo: ITransactionRepo) {
    this.transactionRepo = transactionRepo;
  }

  async execute(request: TransactionExternalDTO): Promise<Response> {
    const accountExternalIdDebitOrError = Guid.create(
      new UniqueEntityID(request.accountExternalIdCredit)
    );
    const accountExternalIdCreditOrError = Guid.create(
      new UniqueEntityID(request.accountExternalIdCredit)
    );
    const valueOrError = TransactionValue.create({ value: request.value });

    const dtoResult = Result.combine([
      accountExternalIdDebitOrError,
      accountExternalIdCreditOrError,
      valueOrError,
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue()));
    }

    const transactionExternalOrError = TransactionExternal.create({
      accountExternalIdDebit: accountExternalIdDebitOrError.getValue(),
      accountExternalIdCredit: accountExternalIdCreditOrError.getValue(),
      type: request.tranferTypeId,
      value: valueOrError.getValue(),
    });

    if (transactionExternalOrError.isFailure) {
      return left(Result.fail<TransactionExternal>(dtoResult.getErrorValue()));
    }

    try {
      const transaction = transactionExternalOrError.getValue();
      await this.transactionRepo.save(transaction);

      DomainEvents.dispatchEventsForAggregate(transaction.id);

      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error)) as Response;
    }
  }
}
