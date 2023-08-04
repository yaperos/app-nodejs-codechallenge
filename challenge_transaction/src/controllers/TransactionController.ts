'use strict';

import {Request, Response} from "express";
import {DataBaseConnectionService} from "../services/DataBaseConnectionService";
import { ObjectLiteral } from "typeorm";
import {Success, Error} from "../helpers/SystemInterface";
import { Transaction } from "../models/transaction/Transaction";
import { TransactionType } from '../models/transaction/transactionType/TransactionType';
import { TransactionStatus } from '../models/transaction/transactionStatus/TransactionStatus';
import { responseTransaction, kafkaFormat,responseTransactionAntifraud } from '../helpers/TransactionHelper';
import {AntiFraudResponse} from "../models/transaction/ITransaction";
import { KafkaConnection } from '../services/Kafka/KafkaConnection';
import {Consumer} from "kafkajs";
async function createTransaction(req:Request, res:Response) {
    let dataBaseConnection:DataBaseConnectionService = new DataBaseConnectionService(Transaction),
        dataBaseConnection2:DataBaseConnectionService = new DataBaseConnectionService(TransactionType),
        dataBaseConnection3:DataBaseConnectionService = new DataBaseConnectionService(TransactionStatus),
        error:Error = {cod:500, message:'Error general del sistema' },
        success:Success = {cod:200, message:'Consulta exitosa', payload:{} },
        transaction:Transaction = new Transaction(),
        {accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value} = req.body,
        transactionType:TransactionType | ObjectLiteral | {} | null,
        transactionStatus:TransactionStatus| ObjectLiteral | {} | null,
        server_antifraud:string= process.env.ANTIFRAUD_SERVER || 'localhost:3001',
        kafkaConnection:KafkaConnection;

    try{
        transaction.accountExternalIdCredit =  accountExternalIdCredit;
        transaction.accountExternalIdDebit = accountExternalIdDebit;
        transaction.tranferTypeId = tranferTypeId;
        transaction.value = value;
        transaction = await transaction.save();
        transactionType = await dataBaseConnection2.get('id', {id: transaction.tranferTypeId},false);
        transactionStatus = await dataBaseConnection3.get('id', {id: transaction.tranferStatusId}, false);

        kafkaConnection = new KafkaConnection(
                                  kafkaFormat(
                                      responseTransactionAntifraud(transaction, transactionType, transactionStatus),
                                      'transaction'));
        await kafkaConnection.producer();

        res.status(success.cod).json(responseTransaction(transaction, transactionType, transactionStatus));
    }catch (e){
        console.error(e);
        error.message = e;
        res.status(error.cod).json(error);
    }
}

function kafkaConsumerTransaction(){
    let kafkaConnection:KafkaConnection = new KafkaConnection(),
        dataBaseConnection:DataBaseConnectionService = new DataBaseConnectionService(Transaction),
        transaction:Transaction|ObjectLiteral|null|{};
    kafkaConnection.consumer()
                   .then((consumer:Consumer) => {
                       consumer.run({
                           eachMessage: async ({ topic, partition, message }) => {
                               console.log({
                                   partition,
                                   offset: message?.offset,
                                   value: message?.value?.toString(),
                               });
                               let responseKafka:AntiFraudResponse;
                               if(message?.value){
                                   responseKafka = JSON.parse(message?.value?.toString());
                                   transaction = await dataBaseConnection.get('id',
                                       {transactionExternalId: responseKafka.transactionExternalId},
                                       false);
                                   if(transaction instanceof Transaction){
                                       if(responseKafka?.transactionStatus?.id){
                                           transaction.tranferStatusId = responseKafka.transactionStatus.id;
                                           await dataBaseConnection.update(transaction,
                                               "",
                                               {transactionExternalId: transaction.transactionExternalId},
                                               false);
                                       }
                                   }
                               }
                           },
                       });
                   })
}

export { createTransaction, kafkaConsumerTransaction }