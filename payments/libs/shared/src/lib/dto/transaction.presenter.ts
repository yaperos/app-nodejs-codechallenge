import { IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { faker } from '@faker-js/faker';
import { StatusInterface, TransactionModel, TypeInterface } from "../model";

export class TransactionTypePresenter{
    @IsNotEmpty()
    @IsString()
    name: string;

    constructor(name: string){
        this.name = name;
    }

    static createSameBankTransferTransactionType(){
        return ({name: TypeInterface.LOCAL_INTERBANK} as TransactionTypePresenter);
    }
}

export class TransactionStatusPresenter{
    @IsNotEmpty()
    @IsString()
    name: string;

    constructor(name: string){
        this.name = name;
    }

    static createPendingTransactionStatus(){
        return ({name: StatusInterface.PENDING} as TransactionStatusPresenter);
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

    static createRandomTransaction(): TransactionPresenter {
        return ({
            transactionExternalId: faker.datatype.uuid(),
            transactionType: TransactionTypePresenter.createSameBankTransferTransactionType(),
            transactionStatus:  TransactionStatusPresenter.createPendingTransactionStatus(),
            value: faker.datatype.number({ min: 900, max: 1500 }),
            createdAt: faker.datatype.datetime()
        } as TransactionPresenter);
        
    }
}

