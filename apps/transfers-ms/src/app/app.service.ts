import { Injectable, NotFoundException } from '@nestjs/common';
import { TransferCommand } from './interfaces/transfer.command';
import { AntifraudService } from '@app-nodejs-codechallenge/antifraud-lib';

import {
  PrismaService,
  TransactionStatus,
} from '@app-nodejs-codechallenge/core-lib';
@Injectable()
export class AppService {
  constructor(
    private readonly antifraudService: AntifraudService,
    private readonly prismaService: PrismaService
  ) {}

  async getTransaction(id: string) {
    const tx = await this.prismaService.transaction.findUnique({
      where: { id },
      include: {
        transferType: true,
      },
    });

    if (!tx) {
      throw new NotFoundException('Transaction not found');
    }

    return {
      transactionExternalId: tx.accountExternalIdDebit,
      transactionType: {
        name: tx.transferType.name,
      },
      transactionStatus: {
        name: tx.status.toString(),
      },
      value: tx.value,
      createdAt: tx.createdAt,
    };
  }

  async saveTransfer(transfer: TransferCommand) {
    const transferType = await this.prismaService.transferType.findUnique({
      where: { id: transfer.transferTypeId },
    });

    if (!transferType) {
      throw new NotFoundException('Transfer type not found');
    }

    const tx = await this.prismaService.transaction.create({
      data: {
        value: transfer.value,
        accountExternalIdDebit: transfer.accountExternalIdDebit,
        accountExternalIdCredit: transfer.accountExternalIdCredit,
        transferTypeId: transfer.transferTypeId,
        status: TransactionStatus.PENDING,
      },
    });

    const antifraud = await this.antifraudService.validateTransaction({
      key: tx.id,
      amount: transfer.value,
      from: transfer.accountExternalIdDebit,
      to: transfer.accountExternalIdDebit,
    });

    const status = antifraud.isFraud
      ? TransactionStatus.REJECTED
      : TransactionStatus.APPROVED;

    const txUpdate = await this.prismaService.transaction.update({
      where: { id: tx.id },
      data: { status },
    });

    return {
      message: antifraud.message,
      transactionExternalId: txUpdate.accountExternalIdDebit,
      transactionType: {
        name: transferType.name,
      },
      transactionStatus: {
        name: txUpdate.status.toString(),
      },
      value: txUpdate.value,
      createdAt: txUpdate.createdAt,
    };
  }
}
