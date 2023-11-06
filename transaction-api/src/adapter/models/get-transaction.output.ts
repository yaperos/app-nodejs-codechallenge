import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EnumName {
  @Field()
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
}

@ObjectType()
export class GetTransactionOutput {
  @Field() readonly transactionExternalId: string;
  @Field() readonly transactionType: EnumName;
  @Field() readonly transactionStatus: EnumName;
  @Field() readonly value: number;
  @Field() readonly createdAt: Date;

  constructor(
    id: string,
    transactionTypeName: string,
    transactionStatusName: string,
    value: number,
    createdAt: Date,
  ) {
    this.transactionExternalId = id;
    this.transactionType = new EnumName(transactionTypeName);
    this.transactionStatus = new EnumName(transactionStatusName);
    this.value = value;
    this.createdAt = createdAt;
  }
}
