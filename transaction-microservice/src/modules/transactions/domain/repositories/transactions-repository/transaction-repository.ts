import { HttpException } from '@nestjs/common';
import { EitherAsync } from 'purify-ts';
import {
  RegisterTransactionInput,
  RegisterTransactionOutput,
} from './transaction-repository.type';

export abstract class TransactionRepository {
  abstract registerTransaction(
    input: RegisterTransactionInput,
  ): EitherAsync<HttpException, RegisterTransactionOutput>;
}
