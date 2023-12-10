import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { PaginationArgs } from './dto/pagination.args';
import { getObjectId, toBase64 } from './utils';
import { Transaction } from '@app/common';
import { TransactionsService } from './transactions.service';

@Resolver('Transaction')
export class TransactionsResolver {
  constructor(private readonly transactionService: TransactionsService) {}

  @Mutation('createTransaction')
  async create(
    @Args('input')
    createTransactionInput: CreateTransactionInput,
  ) {
    try {
      createTransactionInput.tranferTypeId = getObjectId(
        createTransactionInput.tranferTypeId,
      );
      const transaction = await this.transactionService.create(
        createTransactionInput,
      );
      return { success: true, message: 'Transaction saved!', transaction };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Query('transactions')
  findAll(@Args() paginationArgs: PaginationArgs) {
    return this.transactionService.findAll(paginationArgs);
  }

  @Query('transaction')
  findOne(@Args('id') id: string) {
    return this.transactionService.findOne(getObjectId(id));
  }

  @ResolveField('transactionExternalId')
  transactionExternalId(@Parent() transaction: Transaction) {
    return toBase64(`Transaction:${transaction.transactionExternalId}`);
  }

  @ResolveField('transactionStatus')
  transactionStatusCustom(@Parent() transaction: Transaction) {
    return { name: transaction.status };
  }
}
