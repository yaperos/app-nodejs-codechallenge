import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { TransactionCreatedDto } from "@shared/contracts/events/transaction-created";
import { PrismaService } from "@shared/db";
import { Topics } from "@shared/messaging";
import { KafkaProducer } from "@shared/messaging/messaging-kafka";
import { CreateTransactionDto } from "apps/transactions-api/src/transactions/dtos/requests/create-transaction.dto";
import { UpdateTransactionDto } from "apps/transactions-api/src/transactions/dtos/requests/update-transaction.dto";
import { TransactionDto } from "apps/transactions-api/src/transactions/dtos/responses/transaction.dto";
import { TransactionStatusEnum } from "apps/transactions-api/src/transactions/enums/transaction-status.enum";
import { CACHE_PORT, type CachePort,keys } from "libs/cache/src";
import { TTL } from "libs/cache/src/ttl";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionsService {
  private readonly logger: Logger

  constructor(private producer: KafkaProducer, private prisma: PrismaService, @Inject(CACHE_PORT) private cache: CachePort) {
    this.logger = new Logger(TransactionsService.name);
  }

  async create(params: CreateTransactionDto): Promise<TransactionDto> {
    try {
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

    const eventPayload: TransactionCreatedDto = {
      value: tx.value,
      createdAt: tx.createdAt,
      transactionTypeName: tx.type.name,
      transactionExternalId: externalId,
      transactionStatus: tx.status as TransactionStatusEnum,
    };

    await this.producer.publish(Topics.TransactionCreated, externalId, eventPayload);

      return eventPayload
    } catch (error) {
      this.logger.error(`Error creating transaction`, error);

      throw new InternalServerErrorException();
    }
  }

  async getByExternalId(externalId: string): Promise<TransactionDto> {
    try {
    const cached = await this.cache.getJson<TransactionDto>(keys.tx(externalId));

    if (cached) {
      return {...cached, transactionStatus: cached.transactionStatus as TransactionStatusEnum, createdAt: new Date(cached.createdAt)};
    }

    const tx = await this.prisma.transaction.findUniqueOrThrow({
      where: { externalId },
      include: { type: true },
    });

    const txDto: TransactionDto = {
      value: tx.value,
      createdAt: tx.createdAt,
      transactionTypeName: tx.type.name,
      transactionExternalId: tx.externalId,
      transactionStatus: tx.status as TransactionStatusEnum,
    };

    await this.cache.setJson(keys.tx(externalId), txDto, TTL.tx);

    return txDto;
    } catch (error) {
      this.logger.error(`Error getting transaction by external id ${externalId}`, error);

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Transaction not found');
      }

      throw new InternalServerErrorException();
    }
  }

  async applyValidation(input: UpdateTransactionDto): Promise<TransactionDto> {
    try {
    const tx = await this.prisma.transaction.update({
      where: { externalId: input.transactionExternalId },
      data: { status: input.transactionStatus },
      include: { type: true },
    });

    await this.cache.del(keys.tx(input.transactionExternalId));

    return {
      value: tx.value,
      createdAt: tx.createdAt,
      transactionTypeName: tx.type.name,
      transactionExternalId: tx.externalId,
        transactionStatus: tx.status as TransactionStatusEnum,
      };
    } catch (error) {
      this.logger.error(`Error applying validation to transaction ${input.transactionExternalId}`, error);
      
      throw new InternalServerErrorException();
    }
  }
}