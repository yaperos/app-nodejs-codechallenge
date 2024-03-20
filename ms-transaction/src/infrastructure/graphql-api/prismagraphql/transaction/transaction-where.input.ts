import { Field, InputType } from '@nestjs/graphql';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { IntFilter } from '../prisma/int-filter.input';
import { StringFilter } from '../prisma/string-filter.input';

@InputType()
export class TransactionWhereInput {
  @Field(() => [TransactionWhereInput], { nullable: true })
  AND?: Array<TransactionWhereInput>;

  @Field(() => [TransactionWhereInput], { nullable: true })
  OR?: Array<TransactionWhereInput>;

  @Field(() => [TransactionWhereInput], { nullable: true })
  NOT?: Array<TransactionWhereInput>;

  @Field(() => IntFilter, { nullable: true })
  id?: IntFilter;

  @Field(() => StringFilter, { nullable: true })
  externalId?: StringFilter;

  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: DateTimeFilter;

  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: DateTimeFilter;
}
