import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateTransaction {

    @Field({ nullable: true })
    accountExternalIdDebit?: number;

    @Field({ nullable: true })
    accountExternalIdCredit?: number;

    @Field({ nullable: true })
    tranferTypeId: number;

    @Field()
    value: number;

}
