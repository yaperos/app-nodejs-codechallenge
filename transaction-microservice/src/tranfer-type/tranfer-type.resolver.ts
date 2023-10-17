import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TranferTypeService } from './tranfer-type.service';
import { TranferType } from './entities/tranfer-type.entity';
import { CreateTranferTypeInput } from './dto/create-tranfer-type.input';
import { UpdateTranferTypeInput } from './dto/update-tranfer-type.input';

@Resolver(() => TranferType)
export class TranferTypeResolver {
  constructor(private readonly tranferTypeService: TranferTypeService) {}

  @Mutation(() => TranferType)
  createTranferType(@Args('createTranferTypeInput') createTranferTypeInput: CreateTranferTypeInput) {
    return this.tranferTypeService.create(createTranferTypeInput);
  }

  @Query(() => [TranferType], { name: 'tranferTypes' })
  findAll() {
    return this.tranferTypeService.findAll();
  }

  @Query(() => TranferType, { name: 'tranferType' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tranferTypeService.findOneById(id);
  }
}
