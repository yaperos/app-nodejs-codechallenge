import { Field, InputType, Int } from '@nestjs/graphql';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { TransactionWhereInput } from './transaction-where.input';

@InputType()
export class TransactionWhereUniqueInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: false })
  externalId: string;

  @Field(() => [TransactionWhereInput], { nullable: true })
  AND?: Array<TransactionWhereInput>;

  @Field(() => [TransactionWhereInput], { nullable: true })
  OR?: Array<TransactionWhereInput>;

  @Field(() => [TransactionWhereInput], { nullable: true })
  NOT?: Array<TransactionWhereInput>;

  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: DateTimeFilter;

  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: DateTimeFilter;
}
