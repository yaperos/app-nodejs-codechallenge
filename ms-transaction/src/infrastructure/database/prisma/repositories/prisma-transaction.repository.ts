import { Injectable } from '@nestjs/common';
import type { TransactionEntity } from 'src/domain/entities/transaction.entity';
import type { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import type { TransferStatus } from '../../../../domain/interfaces/transaction.interface';
import { ExceptionsService } from '../../../services/exceptions/exceptions.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { PrismaTransactionMapper } from '../mappers/prisma-transaction.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly exceptionService: ExceptionsService,
    private readonly loggerService: LoggerService,
  ) {}

  async create(transaction: TransactionEntity): Promise<void> {
    try {
      this.loggerService.log(
        'Creating transaction',
        JSON.stringify(transaction),
      );
      const transactionPrismaData =
        PrismaTransactionMapper.toPrisma(transaction);

      await this.prismaService.transaction.create({
        data: transactionPrismaData,
      });
    } catch (error) {
      this.loggerService.error('Error creating transaction', error);
      this.exceptionService.internalServerErrorException({
        message: 'Error creating transaction',
      });
    }
  }

  async findByExternalId(
    externalId: string,
  ): Promise<TransactionEntity | null> {
    try {
      this.loggerService.log('Finding transaction', externalId);
      const transactionPrismaData =
        await this.prismaService.transaction.findFirst({
          where: { externalId: externalId },
        });

      if (!transactionPrismaData) {
        return null;
      }

      const transaction = PrismaTransactionMapper.toDomain(
        transactionPrismaData,
      );

      return transaction;
    } catch (error) {
      this.loggerService.error('Error finding transaction', error);
      this.exceptionService.internalServerErrorException({
        message: 'Error finding transaction',
      });
    }
  }

  async updateStatus(
    externalId: string,
    status: TransferStatus,
  ): Promise<void> {
    try {
      this.loggerService.log(
        'Updating transaction status',
        JSON.stringify({ externalId, status }),
      );
      await this.prismaService.transaction.update({
        where: { externalId },
        data: {
          status,
        },
      });
    } catch (error) {
      this.loggerService.error('Error updating transaction status', error);
      this.exceptionService.internalServerErrorException({
        message: 'Error updating transaction status',
      });
    }
  }
}
