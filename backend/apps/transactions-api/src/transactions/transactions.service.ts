import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/db";
import { Topics } from "@shared/messaging";
import { KafkaProducer } from "@shared/messaging/messaging-kafka";
import { CreateTransactionDto } from "apps/transactions-api/src/transactions/dtos/requests/create-transaction.dto";
import { UpdateTransactionDto } from "apps/transactions-api/src/transactions/dtos/requests/update-transaction.dto";
import { TransactionDto } from "apps/transactions-api/src/transactions/dtos/responses/transaction.dto";
import { TransactionStatusEnum } from "apps/transactions-api/src/transactions/enums/transaction-status.enum";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionsService {
  constructor(private producer: KafkaProducer, private prisma: PrismaService) {}

  async create(params: CreateTransactionDto): Promise<TransactionDto> {
    const { transferTypeId, ...transactionParams } = params;
    const externalId = uuidv4();
    
    const tx = await this.prisma.transaction.create({
      data: {
        ...transactionParams,
        externalId,
        typeId: transferTypeId,
        status: TransactionStatusEnum.PENDING,
      },
      include: { type: true },
    });

    await this.producer.publish(Topics.TransactionCreated, externalId, { ...transactionParams, transferTypeId, transactionExternalId: externalId });

    return {
      value: tx.value,
      createdAt: tx.createdAt,
      transactionTypeName: tx.type.name,
      transactionExternalId: tx.externalId,
      transactionStatus: tx.status as TransactionStatusEnum,
    };
  }

  async getByExternalId(externalId: string): Promise<TransactionDto> {
    const tx = await this.prisma.transaction.findUniqueOrThrow({
      where: { externalId },
      include: { type: true },
    });

    return {
      value: tx.value,
      createdAt: tx.createdAt,
      transactionTypeName: tx.type.name,
      transactionExternalId: tx.externalId,
      transactionStatus: tx.status as TransactionStatusEnum,
    };
  }

  async update(input: UpdateTransactionDto): Promise<TransactionDto> {
    const tx = await this.prisma.transaction.update({
      where: { externalId: input.externalId },
      data: { status: input.status },
      include: { type: true },
    });

    return {
      value: tx.value,
      createdAt: tx.createdAt,
      transactionTypeName: tx.type.name,
      transactionExternalId: tx.externalId,
      transactionStatus: tx.status as TransactionStatusEnum,
    };
  }
}