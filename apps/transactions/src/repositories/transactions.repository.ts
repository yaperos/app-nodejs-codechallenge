import { DatabaseService, VerifiedTransactionDto } from '@app/common';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { CreateTransactionDto } from 'apps/api-gateway/src/transactions/dtos/requests/create-transaction.dto';
import { GetTransactionDto } from 'apps/api-gateway/src/transactions/dtos/requests/get-transaction.dto';

@Injectable()
export class TransactionsRepository {
  private readonly logger: Logger;

  constructor(private readonly databaseService: DatabaseService) {
    this.logger = new Logger(TransactionsRepository.name);
  }

  async create(input: CreateTransactionDto): Promise<Transaction> {
    try {
      return this.databaseService.transaction.create({
        data: { amount: input.amount, status: 'PENDING' },
      });
    } catch (error) {
      this.logger.error(error);

      throw new UnprocessableEntityException(error.message);
    }
  }

  async getOne({ uuid }: GetTransactionDto): Promise<Transaction> {
    return this.databaseService.transaction.findFirstOrThrow({
      where: { uuid },
    });
  }

  async updateOne({
    uuid,
    status,
  }: VerifiedTransactionDto): Promise<Transaction> {
    try {
      return this.databaseService.transaction.update({
        where: { uuid },
        data: { status },
      });
    } catch (error) {
      this.logger.error(error);

      throw new UnprocessableEntityException(error.message);
    }
  }
}
