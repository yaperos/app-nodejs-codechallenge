import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { TransactionModel } from "src/domain/model/transaction.model";

export class CreateTransactionDto{
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    accountExternalIdDebit: string;
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    accountExternalIdCredit: string;
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsNumber()
    transferTypeId: number;
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsNumber()
    value: number;
}

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
        this.transactionType = new TransactionTypePresenter("temporal");
        this.transactionStatus =  new TransactionStatusPresenter("temporal");
        this.value = transactionModel.value;
        this.createdAt = transactionModel.createdAt;
    }
}

