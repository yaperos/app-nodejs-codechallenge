import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AccountTypeEnum } from '../enums/account-type.enum';
import { TransactionStatusEnum } from '../enums/transaction-status.enum';
import { AbstractFactory } from './abstract.factory';

type TransactionInput = Partial<Prisma.TransactionCreateInput>;

@Injectable()
export class TransactionFactory extends AbstractFactory<Transaction> {
  constructor(protected readonly prismaService: PrismaService) {
    super();
  }

  async make(input: TransactionInput = {}): Promise<Transaction> {
    return this.prismaService.transaction.create({
      data: {
        externalId: faker.datatype.uuid(),
        transferTypeId: faker.datatype.number({ max: 100 }),
        value: input.value ?? faker.datatype.float(),
        accountType: input.accountType ?? AccountTypeEnum.CREDIT,
        status: input.status ?? TransactionStatusEnum.PENDING,
      },
    });
  }
}
