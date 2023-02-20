import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { BadRequestException } from '@nestjs/common/exceptions';
import { EitherAsync } from 'purify-ts';
import { eitherAsyncFromSchema } from '../../../../../core/domain/errors';
import { PrismaService } from '../../../../../core/infrastructure/services';
import {
  FindOneTransactionByIdInput,
  FindOneTransactionByIdOutput,
  RegisterTransactionInput,
  RegisterTransactionOutput,
  TransactionRepository,
  UpdateTransactionStatusInput,
  ZFindOneTransactionByIdInput,
  ZRegisterTransactionInput,
  ZUpdateTransactionStatusInput,
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
      return EitherAsync(async ({ throwE }) => {
        try {
          const transaction = await this.prisma.transactions.create({
            data: {
              ...parsed,
              status: ZTransactionStatus.Enum.PENDING,
            },
            include: {
              TransactionTypes: true,
            },
          });
          return {
            ...transaction,
            status: ZTransactionStatus.Enum.PENDING,
            transferType: transaction.TransactionTypes,
          };
        } catch (error) {
          return throwE(new InternalServerErrorException(error));
        }
      });
    });
  }

  updateTransactionStatus(
    input: UpdateTransactionStatusInput,
  ): EitherAsync<HttpException, void> {
    const schemaEither = eitherAsyncFromSchema(
      ZUpdateTransactionStatusInput,
      input,
    );
    return schemaEither.chain((parsed) => {
      return EitherAsync(async ({ throwE }) => {
        try {
          await this.prisma.transactions.update({
            where: {
              id: parsed.id,
            },
            data: {
              status: parsed.status,
            },
          });
        } catch (error) {
          return throwE(new InternalServerErrorException(error));
        }
      });
    });
  }

  findOneTransactionById(
    input: FindOneTransactionByIdInput,
  ): EitherAsync<HttpException, FindOneTransactionByIdOutput> {
    const schemaEither = eitherAsyncFromSchema(
      ZFindOneTransactionByIdInput,
      input,
    );
    return schemaEither.chain((parsed) => {
      return EitherAsync(async ({ throwE }) => {
        try {
          const transaction = await this.prisma.transactions.findUnique({
            where: {
              id: parsed.id,
            },
            include: {
              TransactionTypes: true,
            },
          });
          if (!transaction) 
            return throwE(new BadRequestException('Transaction not found'));
            
          return {
            ...transaction,
            status: ZTransactionStatus.Enum[transaction.status],
            transferType: transaction.TransactionTypes,
          };
        } catch (error) {
          if(error instanceof HttpException)
            return throwE(error);
          return throwE(new InternalServerErrorException(error));
        }
      });
    });
  }
}
