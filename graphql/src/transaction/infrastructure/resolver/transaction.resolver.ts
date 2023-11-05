import { Inject, ParseIntPipe } from '@nestjs/common';
import { TransactionServiceInterface } from '../../domain/interfaces/transaction.service.interface';
import { TransactionMapper } from '../mapper/transaction.mapper';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionCreateInput } from '../dto/transaction.create.input';
import { Transaction } from 'src/transaction/domain/entities/transaction.type';

@Resolver('Transaction')
export class TransactionResolver {
  private mapper: TransactionMapper;
  constructor(
    @Inject('TransactionService')
    private readonly service: TransactionServiceInterface,
  ) {
    this.mapper = new TransactionMapper();
  }

  @Mutation('createTransaction')
  async create(
    @Args('input') args: TransactionCreateInput,
  ): Promise<Transaction> {
    const data = await this.service.create(this.mapper.toDomainCreate(args));
    return this.mapper.toDto(data);
  }

  @Mutation('rejectTransaction')
  async reject(
    @Args('id', ParseIntPipe)
    id: number,
  ): Promise<Transaction> {
    const data = await this.service.reject(id);
    console.log(data);
    return this.mapper.toDto(data);
  }

  @Mutation('approveTransaction')
  async approve(
    @Args('id', ParseIntPipe)
    id: number,
  ): Promise<Transaction> {
    const data = await this.service.approve(id);
    return this.mapper.toDto(data);
  }

  @Query('transaction')
  async findOneById(
    @Args('id', ParseIntPipe)
    id: number,
  ): Promise<Transaction> {
    return this.mapper.toDto(await this.service.getById(id));
  }
}
