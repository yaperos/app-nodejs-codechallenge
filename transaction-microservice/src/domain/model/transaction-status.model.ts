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