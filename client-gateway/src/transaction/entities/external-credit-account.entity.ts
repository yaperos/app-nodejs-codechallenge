import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExternalCreditAccount {
  @Field(() => String)
  id: string;

  @Field(() => String)
  accountNumber: string;
  @Field(() => String)
  bankName: string;
  @Field(() => String)
  bankCode: string;
  @Field(() => String)
  currency: string;
  @Field(() => String)
  country: string;
  @Field(() => String)
  holderName: string;
  @Field(() => String, { nullable: true })
  holderDocument?: string;

  @Field(() => Float)
  creditLimit: number;
  @Field(() => Float)
  debtBalance: number;

  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
