import { Injectable } from '@nestjs/common';
import { TransactionUpdatedDto } from '../dto/response/transaction-updated.dto';
import { TransactionResponse } from '../dto/response/transaction-response.interface';
import { getTransactionTypeLabel, getTransactionStatusLabel } from '@nodejs-codechallenge/shared/enum';
import { TransactionFindeddDto } from '../dto/response/transaction-finded.dto';

@Injectable()
export class TransactionResponseMapper {

    toResponse(transactionUpdatedDto: TransactionUpdatedDto | TransactionFindeddDto) : TransactionResponse {
        
        return {
            transactionExternalId: transactionUpdatedDto.transactionExternalId,
            transactionType: {
                name: getTransactionTypeLabel(transactionUpdatedDto.tranferTypeId)
            },
            transactionStatus: {
                name: getTransactionStatusLabel(transactionUpdatedDto.status)
            },
            value: transactionUpdatedDto.amount,
            createdAt: transactionUpdatedDto.createdAt
        };
    }

}