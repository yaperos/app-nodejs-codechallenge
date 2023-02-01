export enum StatusInterface {
	PENDING = 'pending',
	APPROVED = 'approved',
	REJECTED = 'rejected'
}

export class TransactionStatusModel{
    id: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, description: string) {
        this.id = id;
        this.description = description;
    }
}