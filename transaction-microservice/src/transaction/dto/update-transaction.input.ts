import {Field, InputType, Int} from '@nestjs/graphql';

@InputType()
export class UpdateTransactionInput {

    @Field(() => Int)
    id: number;
   
    @Field()
    accountExternalIdDebit: string;
    
    @Field()
    accountExternalIdCredit: string;
    
    @Field((type)=>Int)
    value:number;

    @Field(()=>Int)
    transactionStatusId: number;

    @Field(()=>Int)
    tranferTypeId: number
}
