import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TransactionInputDto } from './dto/transaction.input';
import { AppService } from './app.service';
import { TransactionOutputDto } from './dto/transaction.output';
import { TransactionDto } from './dto/transaction.dto';

@Resolver(() => TransactionInputDto)
export class AppResolver {
  public constructor(private appService: AppService) {}

  @Query(() => [TransactionDto])
  public async getTransactions(): Promise<TransactionDto[]> {
    return this.appService.getAllTransactions();
  }

  @Mutation(() => TransactionOutputDto)
  public async addTransaction(@Args('input') transactionInputDto: TransactionInputDto,): Promise<TransactionOutputDto> {
    return this.appService.create(transactionInputDto);
  }
}