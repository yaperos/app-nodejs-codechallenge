export enum TypeInterface {
	SAME_BANK = 'Same bank transfers',
	LOCAL_INTERBANK = 'Local interbank transfers',
	FOREIGN_INTERBANK = 'Foreign interbank transfers'
}

export class TransactionTypeModel{
    id: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, description: string) {
        this.id = id;
        this.description = description;
    }
}