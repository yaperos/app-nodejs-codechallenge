/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from 'class-validator';
import { TransactionStatusResponseDto } from './transaction-status.response.dto';
import { TransactionTypeResponseDto } from './transaction-type.response.dto';
import { FinancialTransaction } from 'src/entities/financial-transaction.entity';

export class TransactionResponseDto {

    constructor(financialTransaction: FinancialTransaction) {
        this.transactionExternalId = financialTransaction.transactionExternalId;
        this.transactionType = new TransactionTypeResponseDto("test");
        this.transactionStatus = new TransactionTypeResponseDto(financialTransaction.transactionStatus);
        this.value = financialTransaction.value;
        this.createdAt = financialTransaction.createdAt.toISOString();

    }


    @IsString()
    transactionExternalId: string;

    transactionType: TransactionTypeResponseDto;

    transactionStatus: TransactionStatusResponseDto;

    @IsNumber()
    value: number;

    @IsString()
    createdAt: string;

}