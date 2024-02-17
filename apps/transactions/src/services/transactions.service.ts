import { CacheService, VerifiedTransactionDto } from '@app/common';
import { ANTI_FRAUD_SERVICE } from '@app/common/constants/service-names';
import { VALIDATE_TRANSACTION } from '@app/common/constants/transaction-events';
import {
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionDto } from 'apps/api-gateway/src/transactions/dtos/requests/create-transaction.dto';
import { GetTransactionDto } from 'apps/api-gateway/src/transactions/dtos/requests/get-transaction.dto';
import { TransactionDto } from 'apps/api-gateway/src/transactions/dtos/responses/transaction.dto';
import { TransactionStatusEnum } from 'apps/api-gateway/src/transactions/enums/transaction.enum';
import { TransactionsRepository } from 'apps/transactions/src/repositories/transactions.repository';

@Injectable()
export class TransactionsService {
  private readonly logger: Logger;

  constructor(
    @Inject(ANTI_FRAUD_SERVICE) private readonly client: ClientKafka,
    private readonly cacheService: CacheService,
    private readonly transactionRepository: TransactionsRepository,
  ) {
    this.logger = new Logger(TransactionsService.name);
  }

  async create(input: CreateTransactionDto): Promise<TransactionDto> {
    try {
      const transaction = await this.transactionRepository.create(input);

      this.client.emit(VALIDATE_TRANSACTION, transaction);

      return {
        uuid: transaction.uuid,
        amount: transaction.amount,
        status: TransactionStatusEnum[transaction.status],
        createdAt: transaction.createdAt,
      };
    } catch (error) {
      this.logger.error(error);

      throw new UnprocessableEntityException(error.message);
    }
  }

  async getOne({ uuid }: GetTransactionDto): Promise<TransactionDto> {
    const cachedTransaction = (await this.cacheService.getOne(
      uuid,
    )) as TransactionDto;

    if (cachedTransaction) {
      return cachedTransaction;
    }

    const transaction = await this.transactionRepository.getOne({ uuid });

    await this.cacheService.create(uuid, transaction);

    return {
      uuid: transaction.uuid,
      amount: transaction.amount,
      status: TransactionStatusEnum[transaction.status],
      createdAt: transaction.createdAt,
    };
  }

  async updateStatus(input: VerifiedTransactionDto) {
    try {
      const transaction = await this.transactionRepository.updateOne(input);

      await this.cacheService.update(transaction.uuid, transaction);
    } catch (error) {
      this.logger.error(error);

      throw new UnprocessableEntityException(error.message);
    }
  }
}
