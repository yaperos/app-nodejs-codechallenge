import {
  AppError,
  Either,
  Result,
  UseCase,
  left,
  right,
} from 'clean-common-lib';
import { TransactionExternal } from '../../domain';
import { GetTransactionExternalDTO } from './GetTransactionExternalDTO';
import { ITransactionRepo } from '../../repositories/transactionRepo';
import { GetTransactionExternalErrors } from './GetTransactionExternalErrors';

type Response = Either<
  | GetTransactionExternalErrors.TransactionExternalDoNotExists
  | AppError.UnexpectedError,
  Result<TransactionExternal>
>;

export class GetTransactionExternal
  implements UseCase<GetTransactionExternalDTO, Promise<Response>>
{
  private transactionRepo: ITransactionRepo;

  constructor(transactionRepo: ITransactionRepo) {
    this.transactionRepo = transactionRepo;
  }

  async execute(request: GetTransactionExternalDTO): Promise<Response> {
    try {
      const transactionExternal = await this.transactionRepo.getTransactionById(
        request.transactionExternalId
      );

      if (!transactionExternal) {
        return left(
          new GetTransactionExternalErrors.TransactionExternalDoNotExists(
            request.transactionExternalId
          )
        );
      }
      return right(Result.ok<TransactionExternal>(transactionExternal));
    } catch (error) {
      return left(new AppError.UnexpectedError(error)) as Response;
    }
  }
}
