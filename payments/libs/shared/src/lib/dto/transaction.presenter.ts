import { IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { TransactionModel } from "../model";

export class TransactionTypePresenter{
    @IsNotEmpty()
    @IsString()
    name: string;

    constructor(name: string){
        this.name = name;
    }
}

export class TransactionStatusPresenter{
    @IsNotEmpty()
    @IsString()
    name: string;

    constructor(name: string){
        this.name = name;
    }
}

export class TransactionPresenter{
    @IsNotEmpty()
    @IsUUID()
    transactionExternalId: string;
    transactionType: TransactionTypePresenter;
    transactionStatus: TransactionStatusPresenter;
    @IsNotEmpty()
    @IsNumber()
    value: number;
    @IsNotEmpty()
    @IsDate()
    createdAt: Date;

    constructor(transactionModel: TransactionModel){
        this.transactionExternalId = transactionModel.externalId;
        this.transactionType = new TransactionTypePresenter(transactionModel.type.description);
        this.transactionStatus =  new TransactionStatusPresenter(transactionModel.status.description);
        this.value = transactionModel.value;
        this.createdAt = transactionModel.createdAt;
    }
}

