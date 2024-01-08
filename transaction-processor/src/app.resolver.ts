import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CreateTransactionInputDto } from './dtos/create-transaction.input';
import { AppService } from './app.service';
import { CreateTransactionOutputDto } from './dtos/create-transaction.output';
import { TransactionDto } from './dtos/transaction.dto';

@Resolver(() => CreateTransactionInputDto)
export class AppResolver {
  public constructor(private appService: AppService) {}

  @Query(() => [TransactionDto])
  public async getTransactions(): Promise<TransactionDto[]> {
    return this.appService.getAllTransactions();
  }

  @Mutation(() => CreateTransactionOutputDto)
  public async createTransaction(
    @Args('input') createTransactionDto: CreateTransactionInputDto,
  ): Promise<CreateTransactionOutputDto> {
    return this.appService.create(createTransactionDto);
  }
}
