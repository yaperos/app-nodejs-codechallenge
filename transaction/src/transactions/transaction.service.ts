import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Transaction } from '@prisma/client';
import { NewTransaction, UpdateTransaction, Response, TransactionDB } from 'src/graphql';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  // Get a single transaction
  async transaction(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }

  // Get multiple transactions
  async transactions(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({});
  }

  // Create a transaction
  async createTransaction(input: any): Promise<Response> {
    let status = "pending"
    if (input.tranferTypeId !== 1 || input.value > 1000) {
      status = "rejected"
    }
    input.status = status
    const base = this.prisma.transaction.create({
      data: input,
    });
    return {
        transactionExternalId: "Guid",
        transactionType: {
          name: "1"
        },
        transactionStatus: {
          name: status
        },
        value: input.value,
        createdAt: String(new Date().valueOf())
      }
  }

  // Update a transaction
  async updateTransaction(params: UpdateTransaction): Promise<Transaction> {
    const { id, status } = params;
    return this.prisma.transaction.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...(status && { status }),
      },
    });
  }

  // delete a transaction
  async deleteTransaction(id: string): Promise<Transaction> {
    return this.prisma.transaction.delete({
      where: {
        id: parseInt(id),
      },
    });
  }

}