import {
  Resolver,
  Mutation,
  Query,
  Args,
} from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import {
  Transaction,
  CreateTransactionReq,
  TransactionRes,
  GetTransactionReq,
} from './dto';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => TransactionRes, {
    description: 'Obtiene una transacción según su external ID',
  })
  async getByExternalId(
    @Args() requestArguments: GetTransactionReq,
  ): Promise<TransactionRes> {
    return await this.transactionService.getByExternalId(requestArguments.transactionExternalId);
  }

  @Mutation(() => TransactionRes, {
    description: 'Procesa un transacción.',
  })
  async create(
    @Args() requestArguments: CreateTransactionReq,
  ): Promise<TransactionRes> {
    return await this.transactionService.create(requestArguments);
  }
}
