
import { Transaction } from '../models/transaction/Transaction';
import { TransactionStatus } from '../models/transaction/transactionStatus/TransactionStatus';
import { ITransactionResponse } from '../models/transaction/ITransaction'
import { IKafkaMessage } from '../providers/kafka/IKafka';
import {ObjectLiteral} from "typeorm";

function responseTransaction(
    transaction:Transaction,
    transactionStatus:TransactionStatus|ObjectLiteral | {} | null){

    let iTransactionResponse: ITransactionResponse,
        id:number= 0,nameStatus:string = 'N/A' ;

    if (transactionStatus instanceof TransactionStatus) {
        nameStatus = transactionStatus?.name;
        id = transactionStatus?.id;
    }

    iTransactionResponse = {
        transactionExternalId: transaction.transactionExternalId,
        transactionStatus: {id: id,name: nameStatus},
        createdAt: transaction.createdAt
    };

    //Para pruebas de caso de uso de actualizacion en el microservicio transacional
    /*iTransactionResponse = {
        transactionExternalId: transaction.transactionExternalId,
        transactionStatus: {id: 3,name: 'Rejected'},
        createdAt: transaction.createdAt
    };*/

    return iTransactionResponse;
}

function kafkaFormat(message:ITransactionResponse, kafkaTopic:string):IKafkaMessage{
    let iKafkaMessageI:IKafkaMessage = {topic: kafkaTopic, message:[{value:JSON.stringify(message)}]};
    return iKafkaMessageI;
}

export {responseTransaction, kafkaFormat}