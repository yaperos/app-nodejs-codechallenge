import { DatabaseService } from '@app/common';
import { ANTI_FRAUD_SERVICE } from '@app/common/constants/service-names';
import { VALIDATE_TRANSACTION } from '@app/common/constants/transaction-events';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(ANTI_FRAUD_SERVICE) private readonly client: ClientKafka,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(input): Promise<any> {
    try {
      const transaction = await this.databaseService.transaction.create({
        data: { amount: input.amount, status: 'PENDING' },
      });

      this.client.emit(VALIDATE_TRANSACTION, transaction);

      return {
        uuid: transaction.uuid,
        amount: transaction.amount,
        status: transaction.status,
        createdAt: transaction.createdAt,
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async getOne({ uuid }): Promise<any> {
    const transaction = await this.databaseService.transaction.findFirstOrThrow(
      { where: { uuid } },
    );

    return {
      uuid: transaction.uuid,
      amount: transaction.amount,
      status: transaction.status,
      createdAt: transaction.createdAt,
    };
  }

  async updateStatus({ uuid, status }) {
    try {
      await this.databaseService.transaction.update({
        where: { uuid },
        data: { status },
      });
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
