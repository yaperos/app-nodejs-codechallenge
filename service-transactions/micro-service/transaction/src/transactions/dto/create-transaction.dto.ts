import { InputType, Int, Field, Float } from '@nestjs/graphql';
@InputType()
export class CreateTransactionDto {


    @Field(()  => String)
    accountExternalIdDebit: string

    @Field(()  => String)
    accountExternalIdCredit: string

    @Field(()  => Int)
    transferTypeId: number

    @Field(()  => Int )
    value: number

}



/*export class CreateTransactionDto {

    accountExternalIdDebit: string;
  
    accountExternalIdCredit: string;
  
    transferTypeId: number;
  
    value: number;

}*/