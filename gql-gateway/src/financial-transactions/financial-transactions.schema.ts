/* eslint-disable prettier/prettier */

import { ObjectType, Field, ArgsType } from '@nestjs/graphql'
import { IsString, IsNumber, IsOptional } from 'class-validator';

@ArgsType()
export class CreateTransactionRequest {

    @Field({ nullable: false })
    @IsNumber()
    tranferTypeId: number;

    @Field({ nullable: false })
    @IsNumber()
    value: number;
}

@ObjectType()
export class CreateTransactionResponse {

    @Field({ nullable: false })
    @IsString()
    transactionStatus: string;

    @Field({ nullable: false })
    @IsString()
    transactionDate: string;

    @Field({ nullable: false })
    @IsString()
    transactionExternalId: string;

}

@ObjectType()
export class TransactionTypeResponse {

    @Field({ description: 'Name of transaction type', nullable: true })
    @IsString()
    @IsOptional()
    name?: string;
}

@ObjectType()
export class TransactionStatusResponse {

    @Field({ description: 'Name of transaction status', nullable: false })
    @IsString()
    name: string;
}



@ObjectType()
export class TransactionResponse {

    @Field({ nullable: false })
    @IsString()
    transactionExternalId: string;

    @Field(() => TransactionTypeResponse, { nullable: false, description: 'Transaction type' })
    @IsString()
    transactionType: TransactionTypeResponse;

    @Field(() => TransactionStatusResponse, { nullable: false, description: 'Transaction status' })
    @IsString()
    transactionStatus: TransactionStatusResponse;

    @Field({ description: 'Value of transaction', nullable: false })
    @IsString()
    value: string;

    @Field({ description: 'Transaction creation date', nullable: false })
    @IsString()
    createdAt: string;

}