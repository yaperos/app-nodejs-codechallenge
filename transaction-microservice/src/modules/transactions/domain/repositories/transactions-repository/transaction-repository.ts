import { HttpException } from '@nestjs/common';
import { EitherAsync } from 'purify-ts';
import {
  FindOneTransactionByIdInput,
  FindOneTransactionByIdOutput,
  RegisterTransactionInput,
  RegisterTransactionOutput,
  UpdateTransactionStatusInput,
} from './transaction-repository.type';

export abstract class TransactionRepository {
  abstract registerTransaction(
    input: RegisterTransactionInput,
  ): EitherAsync<HttpException, RegisterTransactionOutput>;
  
  abstract updateTransactionStatus(
    input: UpdateTransactionStatusInput,
  ): EitherAsync<HttpException, void>;

  abstract findOneTransactionById(
    input: FindOneTransactionByIdInput,
  ): EitherAsync<HttpException, FindOneTransactionByIdOutput>;
}
