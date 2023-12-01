import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class TransactionTypeDTO {
  @Field(() => String)
  name: string;
}

@ObjectType()
export class TransactionStatusDTO {
  @Field(() => String)
  name: string;
}
@ObjectType()
export class FindTransactionOutput {
  @Field(() => ID, { nullable: true })
  transactionExternalId?: number;

  @Field(() => TransactionTypeDTO, { nullable: true })
  transactionType?: TransactionTypeDTO;

  @Field(() => TransactionStatusDTO, { nullable: true })
  transactionStatus?: TransactionStatusDTO;

  @Field(() => Number)
  value: number;

  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
}
