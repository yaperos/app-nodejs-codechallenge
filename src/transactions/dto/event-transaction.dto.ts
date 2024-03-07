export class EventTransactionDto{
 	transactionExternalId: string;
  	tranferType: string;
  	value: number;
  	status: string;

  	constructor(transactionExternalId: string, tranferType: string, value: number, status: string) {
	    this.transactionExternalId = transactionExternalId;
	    this.tranferType = tranferType;
		this.value = value;
		this.status = status;
  	}
}