import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBalanceDto,
  EditBalanceDto,
} from './dto';

@Injectable()
export class BalanceService {
  constructor(private prisma: PrismaService) {}

  getBalances(userId: string) {
    return this.prisma.balance.findMany({
      where: {
        userId,
      },
    });
  }
  getAll() {
    return this.prisma.balance.findMany();
  }

  async getBalanceById(balanceId: string) {
    console.time('getBalanceById');
    const balance =
      await this.prisma.balance.findUnique({
        where: { balanceId },
        include: {
          debitTransactions: {
            include: {
              transactionStatus: true,
            },
          },
          creditTransactions: {
            include: {
              transactionStatus: true,
            },
          },
        },
      });
    console.log(balance);

    if (!balance) {
      throw new Error('Balance not found');
    }

    // Filtering and summing approved debit transactions
    const totalDebits = balance.debitTransactions
      .filter((transaction) =>
        transaction.transactionStatus.some(
          (status) =>
            status.statusTransactionId ===
            'APPROVED',
        ),
      )
      .reduce((sum, transaction) => {
        return sum.plus(
          new Decimal(transaction.amount),
        );
      }, new Decimal(0));
    // Filtering and summing approved credit transactions
    const totalCredits =
      balance.creditTransactions
        .filter((transaction) =>
          transaction.transactionStatus.some(
            (status) =>
              status.statusTransactionId ===
              'APPROVED',
          ),
        )
        .reduce((sum, transaction) => {
          return sum.plus(
            new Decimal(transaction.amount),
          );
        }, new Decimal(0));

    const totalBalance =
      totalCredits.minus(totalDebits);

    console.timeEnd('getBalanceById');
    return {
      ...balance,
      totalBalance: totalBalance.toString(),
    };
  }

  async createBalance(dto: CreateBalanceDto) {
    const balance =
      await this.prisma.balance.create({
        data: {
          user: {
            connect: {
              userId: dto.userId,
            },
          },
        },
      });

    return balance;
  }
  async deleteBalanceById(balanceId: string) {
    await this.prisma.balance.update({
      where: {
        balanceId: balanceId,
      },
      data: { deletedAt: new Date() },
    });
  }
}
