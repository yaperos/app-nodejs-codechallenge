import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionstatusService } from './transactionstatus.service';
import { Transactionstatus } from './entities/transactionstatus.entity';
import { CreateTransactionstatusInput } from './dto/create-transactionstatus.input';
import { UpdateTransactionstatusInput } from './dto/update-transactionstatus.input';

@Resolver(() => Transactionstatus)
export class TransactionstatusResolver {
  constructor(private readonly transactionstatusService: TransactionstatusService) {}

  @Mutation(() => Transactionstatus)
  createTransactionstatus(@Args('createTransactionstatusInput') createTransactionstatusInput: CreateTransactionstatusInput) {
    return this.transactionstatusService.create(createTransactionstatusInput);
  }
  

  @Query(() => [Transactionstatus], { name: 'alltransactionstatus' })
  findAll() {
    return this.transactionstatusService.findAll();
  }

  @Query(() => Transactionstatus, { name: 'transactionstatus' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.transactionstatusService.findOne(id);
  }

  @Mutation(() => Transactionstatus)
  updateTransactionstatus(@Args('updateTransactionstatusInput') updateTransactionstatusInput: UpdateTransactionstatusInput) {
    return this.transactionstatusService.update(updateTransactionstatusInput.id, updateTransactionstatusInput);
  }

  @Mutation(() => Transactionstatus)
  removeTransactionstatus(@Args('id', { type: () => Int }) id: number) {
    return this.transactionstatusService.remove(id);
  }
}
