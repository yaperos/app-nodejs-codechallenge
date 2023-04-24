import { IsNotEmpty, IsNumber, IsString,IsIn, Min } from 'class-validator';
import { Field, InputType} from '@nestjs/graphql';


@InputType('CreateTransactionRequest')
export class CreateTransactionRequest {


    @Field()
    @IsNotEmpty({
        message: 'AccountExternalIdDebit is required'
    })
    @IsString()
    accountExternalIdDebit: string;

    @Field()
    @IsNotEmpty({
        message: 'accountExternalIdCredit is required'
    })
    @IsString()
    accountExternalIdCredit: string;

    @Field()
    @IsNotEmpty({
        message: 'TranferTypeId is required'
    })
    @IsNumber()
    @IsIn([1,2,3],{
        message: 'TranferTypeId must be 1,2 or 3'
    })
    tranferTypeId: number;

    @Field()
    @IsNotEmpty({
        message: 'value is required'
    })
    @IsNumber()
    @Min(0.01, {
        message: 'Value must be greater than 0'
    })
    value: number;
}