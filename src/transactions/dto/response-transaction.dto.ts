import { CreateTypeDto } from '../../type/dto/create-type.dto';
import { CreateStatusDto } from '../../status/dto/create-status.dto';
import { Transaction } from '../transaction.entity'
export class ResponseTransactionDto{

    transactionExternalId: string;
    value: number;
    createdAt: Date;
	transactionType: CreateTypeDto;
	transactionStatus: CreateStatusDto

	constructor(transaction: Transaction) {
	    this.transactionExternalId = transaction.transactionExternalId;
	    this.value = transaction.value;
		this.transactionStatus = new CreateStatusDto(transaction.transactionStatus.name);
		this.transactionType = new CreateTypeDto(transaction.transactionType.name)
	}

 }