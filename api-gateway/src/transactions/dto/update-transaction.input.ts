import { CreateTransactionInput } from './create-transaction.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTransactionInput extends PartialType(CreateTransactionInput) {
    @Field()
    id: string;

    @Field()
    accountExternalIdDebit: string;

    @Field()
    accountExternalIdCredit: string;

    @Field( type => Int )
    value: number;

    @Field()
    transactionTypeId: number;

    @Field()
    transactionStatusId: number;

    @Field()
    createdAt: Date
}
