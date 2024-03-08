import { Field, InputType, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateTransactionDto{
	@Field()
	accountExternalIdDebit: string;
	@Field()
 	accountExternalIdCredit: string;
 	@Field((type) => Int)
  	tranferTypeId: number;
  	@Field((type) => Float)
  	value: number
}