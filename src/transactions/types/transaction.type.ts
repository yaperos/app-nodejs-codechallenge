import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  

    @Field()
    id: string;

    @Field()
    accountExternalIdDebit: string;
  

    @Field()
    accountExternalIdCredit: string;

    @Field()
    transferTypeId: number;

    @Field()
    value: number;

    @Field()
    transactionStatus: string;

    @Field()
    createdAt: Date;
}
