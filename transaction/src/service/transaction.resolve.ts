import { Logger } from '@nestjs/common';
import { TransferInput } from 'src/dtos/transaction-request.input';
import { Transaction} from 'src/entities/transaction.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';


@Resolver(() => Transaction)
export class TransactionResolver {
  private readonly logger = new Logger(TransactionResolver.name);

  constructor(
    private readonly transactionService: TransactionService,
  ) {}

  @Query(returns  => [Transaction])
  findAllTransactions(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }
  

  @Mutation(() => Transaction)
  async evaluarTransaccion(
    @Args('transaccionReq') transaccionReq: TransferInput,
  ): Promise<Transaction> {
    return this.transactionService.evaluarTransaccion(transaccionReq);
  }
}
