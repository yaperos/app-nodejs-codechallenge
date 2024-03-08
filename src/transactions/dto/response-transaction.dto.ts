import { TypeDto } from '../../type/dto/type.dto';
import { StatusDto } from '../../status/dto/status.dto';
import { Transaction } from '../transaction.entity'
import { Field, InputType, Int, Float } from '@nestjs/graphql';

export class ResponseTransactionDto{

    transactionExternalId: string;
    value: number;
    createdAt: Date;
	transactionType: TypeDto;
	transactionStatus: StatusDto

	constructor(transaction: Transaction) {
	    this.transactionExternalId = transaction.transactionExternalId;
	    this.value = transaction.value;
		this.transactionStatus = new StatusDto(transaction.transactionStatus.name);
		this.transactionType = new TypeDto(transaction.transactionType.name)
	}

 }