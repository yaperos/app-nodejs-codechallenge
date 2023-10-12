import { Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionCreatedEvent } from '../events/transaction-created.event';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { GetAntifraudRequest } from '../requests/get-antifraud-request.dto';
import { AppService } from 'src/app.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType as PrismaTransactionType, TransactionStatus as PrismaTransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionsService {
  private logger: Logger;

  constructor(@Inject('ANTIFRAUD_SERVICE') private readonly antifraudClient: ClientKafka, private prisma: PrismaService) {
    this.logger = new Logger(AppService.name);
  }
  async handleTransactionCreated({ accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value }: TransactionCreatedEvent) {
    const validateTransaction = new GetAntifraudRequest(accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value);

    try {
      const response = await this.antifraudClient
        .send('validate-transaction', validateTransaction.toString())
        .toPromise();

      this.handleValidationSuccess(response);

      const transactionDto = {
        transactionExternalId: response.transactionExternalId,
        transactionType: PrismaTransactionType[response.transactionType.name],
        transactionStatus: PrismaTransactionStatus[response.transactionStatus.name],
        value: response.value,
        createdAt: new Date(response.createdAt),
      };

      const createdTransaction = await this.prisma.transaction.create({
        data: transactionDto,
      });

      return createdTransaction;
    } catch (error) {
      this.handleValidationError(error);
    }
  }

  private handleValidationSuccess(response) {
    this.logger.log('Transaction validated.', response);
  }

  private handleValidationError(error) {
    this.logger.error('Error during Transaction', error);
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
