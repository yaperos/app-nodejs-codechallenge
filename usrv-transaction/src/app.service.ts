import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { TransactionStatus } from './constants/transaction-status.enum';
import { TransactionType } from './constants/transaction-type.enum';
import { TransactionResponse } from './dto/transaction-response.dto';
import { TransactionSearchedRequest } from './dto/transaction-searched-request.dto';
import { CreateTransactionDto } from './dto/transaction-created.dto';
import { TransactionCreatedEvent } from './events/transaction-created.event';
import { TransactionUpdatedEvent } from './events/transaction-updated.event';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {

  constructor(
    @Inject('ANTIFRAUD_SERVICE') private readonly antiFraudClient: ClientKafka,
    private readonly prismaService: PrismaService,
  ) { }

  async createTransaction(transactionCreatedRequest: CreateTransactionDto): Promise<TransactionResponse> {
    const transactionId = uuidv4();
    
    const createdTransaction = await this.prismaService.transaction.create({
      data: {
        ...transactionCreatedRequest, 
        transactionType: transactionCreatedRequest.accountExternalIdCredit? TransactionType.CREDIT : TransactionType.DEBIT,
        transactionExternalId: transactionId,
        status: TransactionStatus.PENDING
      }
    })
    
    this.antiFraudClient.emit(
      'transaction_created',
      new TransactionCreatedEvent(transactionId, transactionCreatedRequest.value),
    );
    return new TransactionResponse(createdTransaction)
  }

  async getTransaction({ transactionExternalId }: TransactionSearchedRequest): Promise<TransactionResponse> {
    const transaction = await this.prismaService.transaction.findUnique({ where: { transactionExternalId } });

    if (!transaction) {
      throw new NotFoundException(`transaction with email id:${transactionExternalId} not found `)
    }

    return new TransactionResponse({...transaction})
  }

  async updateTransaction({ status, transactionExternalId }: TransactionUpdatedEvent): Promise<void> {

    const transaction = await this.prismaService.transaction.update({
      data: {
        status
      },
      where: { transactionExternalId }
    });

    if (!transaction) {
      throw new NotFoundException(`transaction with email id:${transactionExternalId} not found `)
    }
  }
}
