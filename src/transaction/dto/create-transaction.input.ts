import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

@InputType()
export class CreateTransactionInput {

    @Field()
    @IsNotEmpty()
    @IsString()
    accountExternalIdDebit: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    accountExternalIdCredit: string;

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    tranferTypeId: number;

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(1000)
    value: number;
}
