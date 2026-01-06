import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TRANSACTION_TYPE_MAP } from './transaction.constants';
import { sendTransactionCreated } from '../kafka/transaction.producer';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTransactionDto) {
    if (dto.accountExternalIdDebit === dto.accountExternalIdCredit) {
      throw new BadRequestException(
        'Debit and credit accounts must be different',
      );
    }

   const tx = await this.prisma.transaction.create({
    data: {
      accountExternalIdDebit: dto.accountExternalIdDebit,
      accountExternalIdCredit: dto.accountExternalIdCredit,
      tranferTypeId: dto.tranferTypeId,
      value: dto.value,
      status: 'pending',
    },
    });

    await sendTransactionCreated({
      transactionExternalId: tx.transactionExternalId,
      value: tx.value,
    });

  return tx;
  }

  async findByExternalId(transactionExternalId: string) {
  const tx = await this.prisma.transaction.findUnique({
    where: { transactionExternalId },
  });

  if (!tx) return null;

  return {
    transactionExternalId: tx.transactionExternalId,
    transactionType: {
      name: TRANSACTION_TYPE_MAP[tx.tranferTypeId] ?? 'Desconocido',
    },
    transactionStatus: {
      name: tx.status,
    },
    value: tx.value,
    createdAt: tx.createdAt,
  };
  }
  
}