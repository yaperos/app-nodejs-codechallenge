import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class GetTransactionTypeDto {
    @Field()
    name?: string;
}

@InputType()
export class GetTransactionStatusDto {
    @Field()
    name?: string;
}

@InputType()
export class GetTransactionDto {
    @Field()
    transactionExternalId: string;

    @Field(type => GetTransactionTypeDto, { nullable: true })
    transactionType?: GetTransactionTypeDto;

    @Field(type => GetTransactionStatusDto, { nullable: true })
    transactionStatus?: GetTransactionStatusDto;

    @Field(type => Int, { nullable: true })
    value?: number;

    @Field({ nullable: true })
    createdAt?: Date;
}