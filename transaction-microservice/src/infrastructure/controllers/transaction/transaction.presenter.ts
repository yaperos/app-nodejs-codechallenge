import { ApiProperty } from "@nestjs/swagger";
import { TransactionModel } from "src/domain/model/transaction.model";

export class TransactionTypePresenter{
    @ApiProperty()
    name: string;

    constructor(name: string){
        this.name = name;
    }
}

export class TransactionStatusPresenter{
    @ApiProperty()
    name: string;

    constructor(name: string){
        this.name = name;
    }
}

export class TransactionPresenter{
    @ApiProperty()
    transactionExternalId: string;
    @ApiProperty()
    transactionType: TransactionTypePresenter;
    @ApiProperty()
    transactionStatus: TransactionStatusPresenter;
    @ApiProperty()
    value: number;
    @ApiProperty()
    createdAt: Date;

    constructor(transactionModel: TransactionModel){
        this.transactionExternalId = transactionModel.externalId;
        this.transactionType = new TransactionTypePresenter(transactionModel.type.description);
        this.transactionStatus =  new TransactionStatusPresenter(transactionModel.status.description);
        this.value = transactionModel.value;
        this.createdAt = transactionModel.createdAt;
    }
}

