import { Field, Float, Int, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class TransactionType {

    @Field(() => String, { nullable: true })
    name?: string;
}

@ObjectType()
export class TransactionStatus {

    @Field(() => String, { nullable: true })
    name?: string;
}


@ObjectType()
export class TransactionResponse {

    @Field(() => String, { nullable: true })
    transactionExternalId: string;

    @Field(() => TransactionType, { nullable: true })
    transactionType: TransactionType;

    @Field(() => TransactionType, { nullable: true })
    transactionStatus: TransactionStatus;

    @Field(() => Int, { nullable: true })
    value: number;

    @Field(() => Date, { nullable: true })
    createdAt: Date;
}
