import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateTransactionDto {
    @Field()
    accountExternalIdDebit: string;

    @Field()
    accountExternalIdCredit: string;

    @Field(() => Int)
    tranferTypeId: number;

    @Field(() => Int)
    value: number;
}
