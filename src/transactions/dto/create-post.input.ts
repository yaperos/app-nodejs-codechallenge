import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class CreateTransactionInputDto {
    @Field()
    accountExternalIdDebit: string;
    
    @Field()
    accountExternalIdCredit: string;

    @Field()
    transferTypeId: number;

    @Field()
    value: number;

}