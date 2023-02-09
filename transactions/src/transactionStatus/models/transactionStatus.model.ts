import { ObjectType, Field } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';

@ObjectType()
export class TransactionStatus extends BaseModel {
  @Field(() => String)
  name: string;
}
