import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransacTypeStatusName {
  @Field({ description: 'Name field (string)' })
  name: string;
}

@ObjectType()
export class GetTransactionDto {
  @Field({ description: 'Transaction external ID field (string)' })
  transactionExternalId: string;

  @Field(() => TransacTypeStatusName, { description: 'Transaction type field (TransacTypeStatusName)' })
  transactionType: TransacTypeStatusName;

  @Field(() => TransacTypeStatusName, { description: 'Transaction status field (TransacTypeStatusName)' })
  transactionStatus: TransacTypeStatusName;

  @Field(() => Int, { description: 'Value field (int)' })
  value: number;

  @Field({ description: 'Field created at (Date)' })
  createdAt: Date;
}