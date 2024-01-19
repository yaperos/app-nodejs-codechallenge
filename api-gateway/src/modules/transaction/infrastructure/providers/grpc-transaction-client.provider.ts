import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GrpcError } from 'src/modules/shared/domain/errors/grpc.error';
import { Uuid } from 'src/modules/shared/domain/value-object/uuid';

import {
  CreateTransactionInput,
  TransactionClientProvider,
  TransactionOutput,
} from '../../domain/providers/transaction-client.provider';
import {
  TRANSACTION_SERVICE_NAME,
  TransactionClient,
} from '../resources/transaction.pb';

export class GrpcTransactionClientProvider
  implements TransactionClientProvider, OnModuleInit
{
  private transactionClient: TransactionClient;
  constructor(@Inject(TRANSACTION_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.transactionClient = this.client.getService<TransactionClient>(
      TRANSACTION_SERVICE_NAME,
    );
  }

  async create(
    transactionCreateInput: CreateTransactionInput,
  ): Promise<TransactionOutput> {
    const response = await firstValueFrom(
      this.transactionClient.create({
        id: Uuid.random().value,
        creditAccountExternalId: transactionCreateInput.accountExternalIdCredit,
        debitAccountExternalId: transactionCreateInput.accountExternalIdDebit,
        transferType: `${transactionCreateInput.tranferTypeId}`,
        amount: transactionCreateInput.value,
      }),
    );
    if (!response.data) {
      throw new GrpcError(response.error, response.code, response.messages);
    }
    const transactionData = response.data;
    return {
      transactionExternalId: transactionData.id,
      transactionType: {
        name: transactionData.transferType.name,
      },
      transactionStatus: {
        name: transactionData.validationStatus,
      },
      value: transactionData.amount,
      createdAt: transactionData.createdAt,
    };
  }

  async findOne(transactionExternalId: string): Promise<TransactionOutput> {
    const response = await firstValueFrom(
      this.transactionClient.findOne({
        id: transactionExternalId,
      }),
    );
    if (!response.data) {
      throw new GrpcError(response.error, response.code, response.messages);
    }
    const transactionData = response.data;
    return {
      transactionExternalId: transactionData.id,
      transactionType: {
        name: transactionData.transferType.name,
      },
      transactionStatus: {
        name: transactionData.validationStatus,
      },
      value: transactionData.amount,
      createdAt: transactionData.createdAt,
    };
  }
}
