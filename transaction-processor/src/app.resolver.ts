import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CreateTransactionInputDto } from './dto/create-transaction.input';
import { AppService } from './app.service';
import { CreateTransactionOutputDto } from './dto/create-transaction.output';
import { TransactionDto } from './dto/transaction.dto';

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
