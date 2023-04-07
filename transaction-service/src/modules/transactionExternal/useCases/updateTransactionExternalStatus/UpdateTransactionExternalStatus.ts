import {
  AppError,
  Either,
  Result,
  UseCase,
  left,
  right,
} from 'clean-common-lib';
import { UpdateTransactionExternalErrors } from './UpdateTransactionExternalStatusErrors';
import { UpdateTransactionExternalStatusDTO } from './UpdateTransactionExternalStatusDTO';
import { ITransactionRepo } from '../../repositories/transactionRepo';
import { TransactionStatus } from '../../domain';

type Response = Either<
  | UpdateTransactionExternalErrors.AccountExternalDoNotExists
  | AppError.UnexpectedError
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Result<any>,
  Result<void>
>;

export class UpdateTransactionExternalStatus
  implements UseCase<UpdateTransactionExternalStatusDTO, Promise<Response>>
{
  private transactionRepo: ITransactionRepo;

  constructor(transactionRepo: ITransactionRepo) {
    this.transactionRepo = transactionRepo;
  }

  async execute(
    request: UpdateTransactionExternalStatusDTO
  ): Promise<Response> {
    try {
      const transactionExternal = await this.transactionRepo.getTransactionById(
        request.id
      );

      transactionExternal.updateStatus(
        request.isValid
          ? TransactionStatus.APPROVED
          : TransactionStatus.REJECTED
      );

      this.transactionRepo.update(transactionExternal);

      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error)) as Response;
    }
  }
}
