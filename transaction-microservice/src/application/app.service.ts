import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionDto } from '../domain/requests/create-transaction.dto';
import { TransactionRepository } from '../domain/repositories/transaction-repository';
import { TransactionStatusEnum } from '../domain/enums/transaction-status.enum';
import { TransactionDto } from '../domain/responses/transaction.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger: Logger;

  constructor(
    @Inject('ANTI_FRAUD_MICROSERVICE')
    private readonly antiFraudClient: ClientKafka,
    private readonly transactionRepository: TransactionRepository,
  ) {
    this.logger = new Logger(AppService.name);
  }

  async createTransaction(args: CreateTransactionDto): Promise<void> {
    try {
      const { uuid, value } = await this.transactionRepository.create({
        ...args,
        status: TransactionStatusEnum.PENDING,
      });

      this.antiFraudClient
        .send('validate_transaction', JSON.stringify({ value }))
        .subscribe(async (status) => {
          await this.transactionRepository.update({ uuid, status });
        });
    } catch (error) {
      this.logger.error(error);

      throw new UnprocessableEntityException(error.message);
    }
  }

  async getTransactions(): Promise<TransactionDto[]> {
    const transactions = await this.transactionRepository.getAll();

    const mappedTransactions = transactions.map(
      ({ createdAt, value, externalId, status }) => ({
        createdAt,
        value: value.toNumber(),
        transactionExternalId: externalId,
        transactionType: {
          name: '',
        },
        transactionStatus: {
          name: status,
        },
      }),
    );

    return plainToInstance(TransactionDto, mappedTransactions);
  }

  onModuleInit() {
    this.antiFraudClient.subscribeToResponseOf('validate_transaction');
  }
}
