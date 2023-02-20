import { HttpException } from '@nestjs/common/exceptions';
import { EitherAsync } from 'purify-ts';
import {
  FindOneTransactionTypeByIdInput,
  FindOneTransactionTypeByIdOutput,
} from './transaction-type-repository.type';

export abstract class TransactionTypeRepository {
  abstract findOneTransactionTypeById(
    input: FindOneTransactionTypeByIdInput,
  ): EitherAsync<HttpException, FindOneTransactionTypeByIdOutput>;
}
