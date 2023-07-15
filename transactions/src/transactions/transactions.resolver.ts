import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { Query } from '@nestjs/graphql';
import { Transaction } from './entity/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ResponseTransactionDto } from './dto/response-transaction';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { GetTransactionIdDto } from './dto/get-transaction-id.dto';

@Resolver()
export class TransactionsResolver {
  constructor(private transactionService: TransactionsService) {}

  @Query(() => [Transaction])
  transactions() {
    return this.transactionService.findAll();
  }

  @Query(() => Transaction)
  transactionById(@Args('transactionId') transaction: GetTransactionIdDto) {
    return this.transactionService.findOne(transaction.id);
  }

  @Mutation(() => ResponseTransactionDto)
  public async createTransaction(
    @Args('transactionInput') transactionInput: CreateTransactionDto,
  ): Promise<ResponseTransactionDto> {
    const transaction = await this.transactionService.createTransaction(
      transactionInput,
    );
    this.transactionService
      .validate(transaction)
      .subscribe((responseValidation) => {
        const updateTransactionDto: UpdateTransactionDto = {
          id: responseValidation.id,
          status: responseValidation.status,
        };
        this.transactionService.update(updateTransactionDto);
      });

    return {
      transactionExternalId: transaction.id,
      transactionType: 'YAPE',
      transactionStatus: transaction.status,
      value: transaction.value,
      createdAt: new Date(transaction.createdAt),
    };
  }
}
