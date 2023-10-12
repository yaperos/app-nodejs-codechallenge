import { Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionCreatedEvent } from '../events/transaction-created.event';
import { ClientKafka } from '@nestjs/microservices';
import { GetAntifraudRequest } from '../requests/get-antifraud-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionType as PrismaTransactionType, TransactionStatus as PrismaTransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionsService {
  private logger: Logger;

  constructor(@Inject('ANTIFRAUD_SERVICE') private readonly antifraudClient: ClientKafka, private prisma: PrismaService) {
    this.logger = new Logger(TransactionsService.name);
  }

  async handleTransactionCreated({ accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value }: TransactionCreatedEvent) {
    const validateTransaction = new GetAntifraudRequest(accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value);

    try {
      const response = await this.antifraudClient
        .send('validate-transaction', validateTransaction.toString())
        .toPromise();

      const transactionDto = {
        transactionExternalId: response.transactionExternalId,
        transactionType: PrismaTransactionType[response.transactionType.name],
        transactionStatus: PrismaTransactionStatus[response.transactionStatus.name],
        value: response.value,
        createdAt: new Date(response.createdAt),
      };
      const currentData = await this.prisma.transaction.findFirst({
        where: {
          createdAt: transactionDto.createdAt,
        },
      });

      if (!currentData) {
        this.handleValidationSuccess(response);
        const createdTransaction = await this.prisma.transaction.create({
          data: transactionDto,
        });
        return createdTransaction;
      } else {
        return this.handleConcurrencyConflict();
      }
    }
    catch (error) {
      return this.handleValidationError(error);
    }
  }

  async updatePendingTransactions() {
    const batchSize = 100
    const twelveHoursAgo = new Date();
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

    const pendingTransactions = await this.prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: twelveHoursAgo,
        },
        transactionStatus: 'PENDING',
      },
    });

    for (let i = 0; i < batchSize; i += batchSize) {
      const batch = pendingTransactions.slice(i, i + batchSize);
      await this.processBatch(batch);
    }
  }

  private async processBatch(batch) {
    for (const transaction of batch) {
      await this.prisma.transaction.update({
        where: {
          transactionExternalId: transaction.transactionExternalId,
        },
        data: {
          transactionStatus: 'APPROVED',
        },
      });
    }
  }

  private handleValidationSuccess(response) {
    this.logger.log('Transaction validated.', response);
  }

  private handleValidationError(error) {
    this.logger.error('Error during Transaction', error);
  }
  handleConcurrencyConflict() {
    this.logger.error('Concurrency conflict: Another transaction modified the data concurrently.');
  }

}
