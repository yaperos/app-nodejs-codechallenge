/* eslint-disable prettier/prettier */
import { Field,ObjectType,ArgsType } from '@nestjs/graphql';
import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

@ObjectType()
export class TransactionResponse {
    @Field({ description: 'Request Id of the transaction' })
    requestId: string;
}
@ArgsType()
export class TransactionRequest {
    @Field({ description: 'account external debit Id of the transaction' })
    accountExternalIdDebit: string;

    @Field({ description: 'account external credit Id of the transaction' })
    accountExternalIdCredit: string;
    
    @IsNumber()
    @Field({ description: 'transaction type of the transaction' })
    tranferTypeId: number;
    
    @IsNumber()
    @Min(0)
    @Field({ description: 'value of the transaction' })
    value: number;
}

@ArgsType()
export class StatusRequest {
    @IsString()
    @IsUUID('4', { message: 'requestId should be a valid v4 UUID' })
    @Field({ description: 'Request Id of the transaction' })
    requestId: string;
}

@ObjectType()
export class TransactionStatus {
    @Field({ description: 'name status of transaction' })
    name: string;
}

@ObjectType()
export class TransactionType {
    @Field({ description: 'name type of transaction' })
    name: string;
}

@ObjectType()
export class StatusResponse {
    @Field({ description: 'Transaction External Id of the transaction' })
    transactionExternalId: string;

    @Field(() => TransactionType, { description: 'Type of transaction' })
    transactionType: TransactionType;

    @Field(() => TransactionStatus, { description: 'Status of transaction' })
    transactionStatus: TransactionStatus;

    @Field({ description: 'value of the transaction' })
    value: number;

    @Field({ description: 'Date of the transaction' })
    createdAt: string;
}
