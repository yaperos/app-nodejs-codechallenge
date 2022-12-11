import { TransactionEntity } from "src/transaction/model/entity/transaction-entity"
import { TransactionRequest } from "src/transaction/model/request/transaction-request"
import * as moment from 'moment';
import { VerifyTransactionMessage } from "../model/event/verify-transaction-message";
import { isNull } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, TransactionResponse } from "../model/response/transaction-response";
import { TransactionStatusEnum, TransactionTypeEnum } from "src/util/transaction-enum";

export class TransactionMapper {

     static buildTransactionToSaveFromTransactionRequest(transactionRequest: TransactionRequest) : TransactionEntity {

        const transactionEntity: TransactionEntity = new TransactionEntity(
            transactionRequest.value,
            transactionRequest.tranferTypeId,
            1,
            moment().toDate()
        );

        transactionEntity.account_credit_id = !(isNull(transactionRequest.accountExternalIdCredit)) ? transactionRequest.accountExternalIdCredit : null;
        transactionEntity.account_debit_id = !(isNull(transactionRequest.accountExternalIdDebit)) ? transactionRequest.accountExternalIdDebit : null;

        transactionEntity.uuid = uuidv4();

        return transactionEntity;
    }

    static buildVerifyTransactionMessageFromTransactionSaved(transactionSaved) : VerifyTransactionMessage {

        const verifyTransactionMessage: VerifyTransactionMessage = new VerifyTransactionMessage();
        
        verifyTransactionMessage.id = transactionSaved.id;
        verifyTransactionMessage.amount = transactionSaved.amount;
        verifyTransactionMessage.type = transactionSaved.type;
        verifyTransactionMessage.createdAt = transactionSaved.created_at;
        verifyTransactionMessage.accountCreditId = transactionSaved.account_credit_id;
        verifyTransactionMessage.accountDebitId = transactionSaved.account_debit_id;
        verifyTransactionMessage.uuid = transactionSaved.uuid;

        return verifyTransactionMessage;
    }

    static buildTransactionResponseFromTransactionSaved(transactionSaved) : TransactionResponse {

        const transactionResponse: TransactionResponse = new TransactionResponse();
        
        transactionResponse.transactionExternalId = transactionSaved.uuid;
        transactionResponse.transactionType = new BaseModel(TransactionTypeEnum[transactionSaved.type]);
        transactionResponse.transactionStatus = new BaseModel(TransactionStatusEnum[transactionSaved.status]);
        transactionResponse.value = transactionSaved.amount;
        transactionResponse.createdAt = transactionSaved.createAt;

        return transactionResponse;
    }

    static buildTransactionResponseFromTransactionSavedFirstCase(transactionSaved) : TransactionResponse {

        const transactionResponse: TransactionResponse = new TransactionResponse();
        
        transactionResponse.transactionExternalId = transactionSaved.uuid;
        transactionResponse.transactionType = new BaseModel(TransactionTypeEnum[transactionSaved.type]);
        transactionResponse.transactionStatus = new BaseModel(TransactionStatusEnum[transactionSaved.status]);
        transactionResponse.value = transactionSaved.amount;
        transactionResponse.createdAt = transactionSaved.create_at;

        return transactionResponse;
    }

}