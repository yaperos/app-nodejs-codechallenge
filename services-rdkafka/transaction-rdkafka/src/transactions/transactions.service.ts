import { Injectable } from '@nestjs/common';
import {
  PrismaClient,
  TransactionStatus,
} from '@yape/database/dist/prisma/client';
import { TransactionInput } from './transaction.interface';
import { log } from 'console';

@Injectable()
export class TransactionsService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: TransactionInput) {
    try {
      const transaction = await this.prisma.transaction.create({
        data: {
          ...data,
          transferTypeId: data.transferTypeId,
          status: TransactionStatus.pending,
        },
      });
      return transaction;
    } catch (error) {
      log(error);
    }
  }

  approve(id: string): any {
    log('Approving transaction', id);
    const transaction = this.prisma.transaction
      .update({
        where: {
          id,
        },
        data: {
          status: TransactionStatus.approved,
        },
      })
      .catch((error) => {
        log(error);
      });

    return transaction;
  }

  reject(id: string): any {
    log('Rejecting transaction', id);
    const transaction = this.prisma.transaction
      .update({
        where: {
          id,
        },
        data: {
          status: TransactionStatus.rejected,
        },
      })
      .catch((error) => {
        log(error);
      });

    return transaction;
  }

  get(id: any): any {
    return this.prisma.transaction.findUnique({
      where: {
        id,
      },
    });
  }
}
