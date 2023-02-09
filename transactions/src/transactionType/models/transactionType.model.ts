import { ObjectType, Field } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';

@ObjectType()
export class TransactionType extends BaseModel {
  @Field(() => String)
  name: string;
}
