import { Prisma } from '@prisma/client';

export type TransactionCreateInput = Prisma.TransactionCreateInput;

export type TransactionUpdateInput = Prisma.TransactionUpdateInput;

export type TransactionPayload = Prisma.TransactionGetPayload<{
  select: {
    uuid: true;
    externalId: true;
    accountType: true;
    transferTypeId: true;
    value: true;
    status: true;
    createdAt: true;
    updatedAt: true;
  };
}>;
