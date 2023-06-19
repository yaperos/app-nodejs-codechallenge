import { Injectable } from '@nestjs/common';
import { TransactionStatus } from '@nodejs-codechallenge/shared/enum';
import { ApplicationProperties } from './config/application.properties';

@Injectable()
export class TransactionAmountValidator {

    constructor(
        private readonly applicationProperties: ApplicationProperties
    ){}

    isValid(amount: number) : TransactionStatus {
        
        return amount > this.applicationProperties.getMaxPermitedAmount() ?
            TransactionStatus.REJECTED : 
            TransactionStatus.APPROVED
    }
}