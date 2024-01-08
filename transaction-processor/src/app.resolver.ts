import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CreateTransactionInputDto } from './dto/create-transaction.input';
import { AppService } from './app.service';
import { CreateTransactionOutputDto } from './dto/create-transaction.output';

@Resolver(() => CreateTransactionInputDto)
export class AppResolver {
  public constructor(private appService: AppService) {}

  @Query(() => String)
  public sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => CreateTransactionOutputDto)
  public async createTransaction(
    @Args('input') createTransactionDto: CreateTransactionInputDto,
  ): Promise<CreateTransactionOutputDto> {
    return this.appService.create(createTransactionDto);
  }
}
