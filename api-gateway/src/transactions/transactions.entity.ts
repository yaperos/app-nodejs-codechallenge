import { ArgsType, Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum TransactionStatusEnum {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

registerEnumType(TransactionStatusEnum, {
  name: "TransactionStatusEnum",
  description: "Transaction status enum",
});

@ObjectType()
class TransactionType {
    @Field(() => Int)
    name: Number;
}

@ObjectType()
class TransactionStatus {
    @Field(() => TransactionStatusEnum)
    name: TransactionStatusEnum;
}

@ObjectType()
export class TransactionResponse {
    @Field(() => Int)
    transactionExternalId: Number;

    @Field(() => TransactionType)
    transactionType: TransactionType;

    @Field(() => TransactionStatus)
    transactionStatus: TransactionStatus;

    @Field(() => Int)
    value: Number;

    @Field()
    createdAt: string;
}


@ArgsType()
export class CreateTransactionRequest {
    @Field()
    accountExternalIdDebit: string;

    @Field()
    accountExternalIdCredit: string;

    @Field(type => Int)
    tranferTypeId: Number;

    @Field(type => Int)
    value: Number;
}