import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransfertypesService } from './transfertypes.service';
import { Transfertype } from './entities/transfertype.entity';
import { CreateTransfertypeInput } from './dto/create-transfertype.input';
import { UpdateTransfertypeInput } from './dto/update-transfertype.input';
import { UseInterceptors } from '@nestjs/common';


@Resolver(() => Transfertype)
export class TransfertypesResolver {
  constructor(private readonly transfertypesService: TransfertypesService) {}

  @Mutation(() => Transfertype)
  createTransfertype(@Args('createTransfertypeInput') createTransfertypeInput: CreateTransfertypeInput) {
    return this.transfertypesService.create(createTransfertypeInput);
  }

  @Query(() => [Transfertype], { name: 'transfertypes' })
  findAll() {
    return this.transfertypesService.findAll();
  }

  @Query(() => Transfertype, { name: 'transfertype' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.transfertypesService.findOne(id);
  }

  @Mutation(() => Transfertype)
  updateTransfertype(@Args('updateTransfertypeInput') updateTransfertypeInput: UpdateTransfertypeInput) {
    return this.transfertypesService.update(updateTransfertypeInput.id, updateTransfertypeInput);
  }

  @Mutation(() => Transfertype)
  removeTransfertype(@Args('id', { type: () => Int }) id: number) {
    return this.transfertypesService.remove(id);
  }
}
