import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TransactionCommand, TransactionCommandTypeEnum, TransactionCreatedDto, TransactionStatusEnum } from "@shared/contracts";
import { PrismaService } from "@shared/db";
import { Topics } from "@shared/messaging";
import { KafkaProducer } from "@shared/messaging/messaging-kafka";

@Injectable()
export class CommandsService {
  private readonly logger: Logger

  constructor(private readonly prisma: PrismaService, private readonly producer: KafkaProducer) {
    this.logger = new Logger(CommandsService.name);
  }

  async createTransaction(command: Extract<TransactionCommand, { type: TransactionCommandTypeEnum.CREATE_TRANSACTION }>): Promise<void> {
    try {
      const transaction = await this.prisma.transaction.create({
        data: {
          externalId: command.externalId,
          accountExternalIdDebit: command.accountExternalIdDebit,
          accountExternalIdCredit: command.accountExternalIdCredit,
          typeId: command.transferTypeId,
          value: command.value,
          createdAt: command.createdAt,
        },
        select: {
          id: true,
          value: true,
          createdAt: true,
          externalId: true,
          type: { select: { name: true } },
        },
      });

      const transactionCreatedEvent: TransactionCreatedDto  = {
        value: transaction.value,
        createdAt: transaction.createdAt,
        transactionTypeName: transaction.type.name,
        transactionExternalId: transaction.externalId,
        transactionStatus: TransactionStatusEnum.PENDING,
      };

      await this.producer.publish(Topics.TransactionCreated, transaction.externalId, transactionCreatedEvent);
      
    } catch (error) {
      this.logger.error(error);

      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new BadRequestException('Invalid transaction type');
      }

      throw new InternalServerErrorException();
    }
  }

  async validateTransaction(command: Extract<TransactionCommand, { type: TransactionCommandTypeEnum.VALIDATE_TRANSACTION }>): Promise<void> {
    try {
      await this.prisma.transaction.update({
        where: { externalId: command.externalId, status: TransactionStatusEnum.PENDING },
        data: { status: command.status },
      });
    } catch (error) {
      this.logger.error(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Transaction not found');
      }
    }
  }
}