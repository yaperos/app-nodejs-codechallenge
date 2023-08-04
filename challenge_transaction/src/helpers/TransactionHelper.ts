
import { Transaction } from '../models/transaction/Transaction';
import { TransactionType } from '../models/transaction/transactionType/TransactionType';
import { TransactionStatus } from '../models/transaction/transactionStatus/TransactionStatus';
import { ITransactionResponse, ITransactionResponseKafka } from '../models/transaction/ITransaction'
import {ObjectLiteral} from "typeorm";
import { IKafkaMessage } from '../providers/kafka/IKafka';

function responseTransaction(
    transaction:Transaction,
    transactionType:TransactionType|ObjectLiteral | {} | null,
    transactionStatus:TransactionStatus|ObjectLiteral | {} | null):ITransactionResponse{

    let iTransactionResponse: ITransactionResponse,
        nameType:string = 'N/A', nameStatus:string = 'N/A' ;

    if (transactionType instanceof TransactionType && transactionStatus instanceof TransactionStatus) {
        nameType = transactionType?.name;
        nameStatus = transactionStatus?.name;
    }

    iTransactionResponse = {
        transactionExternalId: transaction.transactionExternalId,
        transactionType: {name: nameType},
        transactionStatus: {name: nameStatus},
        value: transaction.value,
        createdAt: transaction.createdAt
    };

    return iTransactionResponse;
}

function responseTransactionAntifraud(transaction:Transaction,
                                      transactionType:TransactionType|ObjectLiteral | {} | null,
                                      transactionStatus:TransactionStatus|ObjectLiteral | {} | null):ITransactionResponseKafka{
    let iTransactionResponseKafka:ITransactionResponseKafka = {
        transactionExternalId:transaction.transactionExternalId,
        accountExternalIdDebit: transaction.accountExternalIdDebit,
        accountExternalIdCredit: transaction.accountExternalIdCredit,
        tranferTypeId: transaction.tranferTypeId,
        value:transaction.value
    }
    return iTransactionResponseKafka;
}

function kafkaFormat(message:ITransactionResponseKafka, kafkaTopic:string):IKafkaMessage{
    let iKafkaMessageI:IKafkaMessage = {topic: kafkaTopic, message:[{value:JSON.stringify(message)}]};
    return iKafkaMessageI;
}
export {responseTransaction, kafkaFormat, responseTransactionAntifraud}