import { CacheService, DatabaseService } from '@app/common';
import { ANTI_FRAUD_SERVICE } from '@app/common/constants/service-names';
import { VALIDATE_TRANSACTION } from '@app/common/constants/transaction-events';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { GetTransactionDto } from 'apps/api-gateway/src/transactions/dtos/requests/get-transaction.dto';
import { TransactionDto } from 'apps/api-gateway/src/transactions/dtos/responses/transaction.dto';
import { TransactionStatusEnum } from 'apps/api-gateway/src/transactions/enums/transaction.enum';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(ANTI_FRAUD_SERVICE) private readonly client: ClientKafka,
    private readonly cacheService: CacheService,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(input): Promise<TransactionDto> {
    try {
      const transaction = await this.databaseService.transaction.create({
        data: { amount: input.amount, status: 'PENDING' },
      });

      this.client.emit(VALIDATE_TRANSACTION, transaction);

      return {
        uuid: transaction.uuid,
        amount: transaction.amount,
        status: TransactionStatusEnum[transaction.status],
        createdAt: transaction.createdAt,
      };
    } catch (error) {
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

    const transaction = await this.databaseService.transaction.findFirstOrThrow(
      { where: { uuid } },
    );

    await this.cacheService.create(uuid, transaction);

    return {
      uuid: transaction.uuid,
      amount: transaction.amount,
      status: TransactionStatusEnum[transaction.status],
      createdAt: transaction.createdAt,
    };
  }

  async updateStatus({ uuid, status }) {
    try {
      const transaction = await this.databaseService.transaction.update({
        where: { uuid },
        data: { status },
      });

      await this.cacheService.update(uuid, transaction);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
