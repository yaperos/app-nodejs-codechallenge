import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, IsUUID, UUIDVersion} from '@nestjs/class-validator';

@InputType()
export class CreateTransactionInput {

	@Field(() => String, {
		nullable: false,
		description: `Transaction's account external id debit`,
	})
	@IsUUID('all',{each:true})
	accountExternalIdDebit: string;

	@Field(() => String, {
		nullable: false,
		description: `Transaction's account external id debit`,
	})
	@IsUUID('all',{each:true})
	accountExternalIdCredit?: string;

	@Field(() => Number, { 
		nullable: false,
		description: `Transfer id` 
	})
	@IsPositive()
	transferTypeId: number;

	@Field(() => Float, { 
		nullable: false,
		description: `Transaction's value ` 
	})
	@IsPositive()
	value: number;
}

