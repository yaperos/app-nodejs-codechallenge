import { ArgsType, Field } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { TransactionUpdateInput } from './transaction-update.input';
import { TransactionWhereUniqueInput } from './transaction-where-unique.input';

@ArgsType()
export class UpdateOneTransactionArgs {
  @Field(() => TransactionUpdateInput, { nullable: false })
  @Type(() => TransactionUpdateInput)
  data!: TransactionUpdateInput;

  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'externalId'>;
}
