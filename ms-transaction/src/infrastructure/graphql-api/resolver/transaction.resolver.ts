import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionEvent } from '../../../domain/entities/transaction-verify.event';
import { PrismaService } from '../../database/prisma/prisma.service';
import { TransactionProducer } from '../../messaging/producer/transaction.producer';
import {
  CreateOneTransactionArgs,
  FindFirstTransactionArgs,
  Transaction,
} from '../prismagraphql/transaction';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly transactionProducer: TransactionProducer,
  ) {}

  @Query(() => Transaction, { nullable: false })
  findFirstTransaction(@Args() args: FindFirstTransactionArgs) {
    return this.prismaService.transaction.findFirst({ ...args });
  }

  @Mutation(() => Transaction, { nullable: true })
  async createTransaction(@Args() args: CreateOneTransactionArgs) {
    console.log('args', args);

    return this.prismaService.transaction
      .create({
        ...args,
      })
      .then((transaction) => {
        const verifyTransaction = new TransactionEvent(
          transaction.amount,
          transaction.externalId,
        );

        this.transactionProducer.verifyTransaction(verifyTransaction);
        delete transaction.updatedAt;
        return transaction;
      });
  }
}
