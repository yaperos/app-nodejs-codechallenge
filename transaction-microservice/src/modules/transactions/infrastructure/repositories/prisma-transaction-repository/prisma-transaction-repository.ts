import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { EitherAsync } from 'purify-ts';
import { eitherAsyncFromSchema } from '../../../../../core/domain/errors';
import { PrismaService } from '../../../../../core/infrastructure/services';
import {
  RegisterTransactionInput,
  RegisterTransactionOutput,
  TransactionRepository,
  ZRegisterTransactionInput,
} from '../../../domain/repositories';
import { ZTransactionStatus } from '../../../domain/types';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  registerTransaction(
    input: RegisterTransactionInput,
  ): EitherAsync<HttpException, RegisterTransactionOutput> {
    const schemaEither = eitherAsyncFromSchema(
      ZRegisterTransactionInput,
      input,
    );
    return schemaEither.chain((parsed) => {
      return EitherAsync(async () => {
        const transaction = await this.prisma.transactions.create({
          data: {
            ...parsed,
            status: ZTransactionStatus.Enum.PENDING,
          },
        });
        return {
          ...transaction,
          status: ZTransactionStatus.Enum.PENDING,
        };
      });
    });
  }
}
