import { Injectable } from '@nestjs/common';
import { TransactionCreatedDto } from '../dto/response/transaction-created.dto';
import { TransactionCreatedEvent } from '@nodejs-codechallenge/shared/dto';

@Injectable()
export class TransactionEventMapper {

    fromTransactionCreated(transactionCreatedDto: TransactionCreatedDto) : TransactionCreatedEvent {
        
        const transactionCreatedEvent = new TransactionCreatedEvent();
        transactionCreatedEvent.transactionExternalId = transactionCreatedDto.transactionExternalId;
        transactionCreatedEvent.accountExternalIdDebit = transactionCreatedDto.accountExternalIdDebit;
        transactionCreatedEvent.accountExternalIdCredit = transactionCreatedDto.accountExternalIdCredit;
        transactionCreatedEvent.tranferTypeId = transactionCreatedDto.tranferTypeId;
        transactionCreatedEvent.amount = transactionCreatedDto.amount;

        return transactionCreatedEvent;
    }
}
