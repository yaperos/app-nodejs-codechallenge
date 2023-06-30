import { Injectable } from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';
import { CreateTransactionDto } from '../../../in/http/dto/create-transaction-dto';
import { ValidateTransactionRequestDto } from '../dto/validate-transaction-request-dto';

export class ValidateTransactionRequestMapper {

    static map(traceabilityId: string, createTransactionDto: CreateTransactionDto): ValidateTransactionRequestDto {
        const validateTransactionRequestDto = new ValidateTransactionRequestDto();
        validateTransactionRequestDto.traceabilityId = traceabilityId;
        validateTransactionRequestDto.accountExternalIdDebit = createTransactionDto.accountExternalIdDebit;
        validateTransactionRequestDto.accountExternalIdCredit = createTransactionDto.accountExternalIdCredit;
        validateTransactionRequestDto.transferTypeId = createTransactionDto.transferTypeId;
        validateTransactionRequestDto.value = createTransactionDto.value;
        return validateTransactionRequestDto;
  }
}