import { Inject } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionInput } from './dto/createTransaction.input';
import { UpdateTransactionInput } from './dto/updateTransaction.input';
import { Transaction } from './models/transaction.model';

@Resolver()
export class TransactionsResolver {
  constructor(
    private prisma: PrismaService,
    @Inject('KAFKA')
    private readonly kafka: ClientKafka,
  ) {}

  @Query(() => [Transaction])
  async transaction() {
    return this.prisma.transaction.findMany({
      include: {
        transactionStatus: true,
        transactionType: true,
      },
    });
  }

  @Mutation(() => Transaction)
  async createTransaction(@Args('data') data: CreateTransactionInput) {
    const {
      tranferTypeId,
      accountExternalIdCredit,
      accountExternalIdDebit,
      ...transaction
    } = data;

    const newTransaction = await this.prisma.transaction.create({
      data: {
        transactionExternalId: accountExternalIdCredit,
        transactionTypeId: tranferTypeId,
        ...transaction,
      },
      include: {
        transactionStatus: true,
        transactionType: true,
      },
    });

    this.kafka.emit('transaction_created', {
      value: {
        id: newTransaction.id,
        value: newTransaction.value.toString(),
      },
    });

    return newTransaction;
  }

  @Mutation(() => Transaction)
  async updateTransaction(@Args('data') data: UpdateTransactionInput) {
    const { id, tranferStatusId } = data;

    const newTransaction = this.prisma.transaction.update({
      data: {
        transactionStatusId: tranferStatusId,
      },
      where: { id },
      include: {
        transactionStatus: true,
        transactionType: true,
      },
    });

    return newTransaction;
  }
}
