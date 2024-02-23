import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TransactionService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async create(createTransactionDto: CreateTransactionDto) {
    return await this.transaction.create({
      include: {
        transactionStatus: {
          select: { name: true },
        },
        tranferType: {
          select: { name: true },
        },
      },
      data: createTransactionDto,
    });
  }

  async findAll() {
    return await this.transaction.findMany({
      include: {
        transactionStatus: {
          select: { name: true },
        },
        tranferType: {
          select: { name: true },
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.transaction.findUnique({
      where: { id },
      include: {
        transactionStatus: {
          select: { name: true },
        },
        tranferType: {
          select: { name: true },
        },
      },
    });
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return await this.transaction.update({
      where: { id: id },
      data: {
        accountExternalIdCredit: updateTransactionDto.accountExternalIdCredit,
        accountExternalIdDebit: updateTransactionDto.accountExternalIdDebit,
        tranferTypeId: updateTransactionDto.tranferTypeId,
        value: updateTransactionDto.value,
        transactionStatusId: updateTransactionDto.transactionStatusId,
      },
      include: {
        transactionStatus: {
          select: { name: true },
        },
        tranferType: {
          select: { name: true },
        },
      },
    });
  }

  async remove(id: string) {
    return await this.transaction.delete({
      where: { id: id },
    });
  }
}
