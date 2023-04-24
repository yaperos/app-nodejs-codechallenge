import { Field, ObjectType } from "@nestjs/graphql";

export class TransactionDto {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
}

@ObjectType()
class TransactionType {

  @Field()
  name: string;
}

@ObjectType()
class TransactionStatus {

  @Field()
  name: string;
}


@ObjectType()
export class TransactionRespDto {

  @Field()
  transactionExternalId: string;

  @Field(() => TransactionType)
  transactionType: TransactionType;

  @Field(() => TransactionStatus)
  transactionStatus: TransactionStatus;

  @Field()
  value: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

