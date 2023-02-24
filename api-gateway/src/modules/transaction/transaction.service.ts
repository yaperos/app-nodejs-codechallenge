import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EnvConfig } from '../../config/env.config';
import {
  CreateTransactionDto,
  CreateTransactionEvent,
  CreateTransactionResponseDto,
  TransactionPattern,
  TransactionResponse,
} from './transaction.types';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(EnvConfig.kafkaConfig().name)
    private readonly transactionClient: ClientKafka,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    try {
      Logger.log(
        `Create transaction request started with: ${JSON.stringify(
          createTransactionDto,
        )}`,
        TransactionService.name,
      );

      const response = await new Promise<CreateTransactionResponseDto>(
        (resolve) => {
          const { value, ...rest } = createTransactionDto;
          this.transactionClient
            .send(TransactionPattern.CREATE_TRANSACTION, {
              ...rest,
              amount: value,
            } as CreateTransactionEvent)
            .subscribe((result: CreateTransactionResponseDto) =>
              resolve(result),
            );
        },
      );

      const result: TransactionResponse = {
        message: response
          ? 'Transaction created'
          : `Transaction coudn't be created`,
        status: response ? 'SUCCESS' : 'ERROR',
        data: response
          ? {
              transactionExternalId: String(response.id),
              transactionType: response.transactionType,
              transactionStatus: response.transactionStatus,
              value: response.amount,
              createdAt: response.createdAt,
            }
          : undefined,
      };

      Logger.log(
        `Create transaction request finished with: ${JSON.stringify(result)}`,
        TransactionService.name,
      );

      return result;
    } catch (error) {
      Logger.error(error.message, TransactionService.name);
      return {
        message: `There was an internal error. Please contact support`,
        status: 'ERROR',
        data: undefined,
      };
    }
  }
}
