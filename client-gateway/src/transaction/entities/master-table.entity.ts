import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MasterTable {
  @Field(() => String)
  id: string;

  @Field(() => Int, { nullable: true })
  parentId?: number;
  @Field(() => String)
  name: string;
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int)
  order?: number;
  @Field(() => String, { nullable: true })
  value: string;

  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
