import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { TransactionCommand, TransactionCommandTypeEnum } from "@shared/contracts";
import { TransactionStatusEnum } from "@shared/contracts/enums/transaction-status.enum";
import { PrismaService } from "@shared/db";
import { Topics } from "@shared/messaging";
import { KafkaProducer } from "@shared/messaging/messaging-kafka";
import { CreateTransactionDto } from "apps/transactions-api/src/transactions/dtos/requests/create-transaction.dto";
import { TransactionDto } from "apps/transactions-api/src/transactions/dtos/responses/transaction.dto";
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
    const externalId = uuidv4();
    const now = new Date();

    const transactionCommand: TransactionCommand = {
      externalId,
      createdAt: now,
      value: params.value,
      type: TransactionCommandTypeEnum.CREATE_TRANSACTION,
      transferTypeId: params.transferTypeId,
      accountExternalIdDebit:  params.accountExternalIdDebit,
      accountExternalIdCredit: params.accountExternalIdCredit,
    };

    await this.prisma.outbox.create({
      data: { topic: Topics.TransactionCommands, key: externalId, payload: transactionCommand },
    });

    const response: TransactionDto = {
      createdAt: now,
      value: params.value,
      transactionExternalId: externalId,
      transactionTypeName: 'CreateTransactionCommand',
      transactionStatus: TransactionStatusEnum.PENDING,    
    };

    return response;
    } catch (error) {
      this.logger.error(error);

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
}