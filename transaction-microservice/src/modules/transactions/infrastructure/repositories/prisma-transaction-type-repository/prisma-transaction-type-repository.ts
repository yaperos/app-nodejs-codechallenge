import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EitherAsync } from 'purify-ts';
import { eitherAsyncFromSchema } from '../../../../../core/domain/errors';
import { PrismaService } from '../../../../../core/infrastructure/services';
import {
  FindOneTransactionTypeByIdInput,
  FindOneTransactionTypeByIdOutput,
  TransactionTypeRepository,
  ZFindOneTransactionTypeByIdInput,
} from '../../../domain/repositories';

@Injectable()
export class PrismaTransactionTypeRepository
  implements TransactionTypeRepository
{
  constructor(private readonly prisma: PrismaService) {}

  findOneTransactionTypeById(
    input: FindOneTransactionTypeByIdInput,
  ): EitherAsync<HttpException, FindOneTransactionTypeByIdOutput> {
    const schemaEither = eitherAsyncFromSchema(
      ZFindOneTransactionTypeByIdInput,
      input,
    );
    return schemaEither.chain((parsed) => {
      return EitherAsync(async ({ throwE }) => {
        try {
          const transactionType = await this.prisma.transferTypes.findUnique({
            where: {
              id: parsed.id,
            },
          });
          if (!transactionType)
            return throwE(
              new BadRequestException('Transaction type not found'),
            );

          return transactionType;
        } catch (error) {
          if (error instanceof HttpException) return throwE(error);
          return throwE(new InternalServerErrorException(error));
        }
      });
    });
  }
}
