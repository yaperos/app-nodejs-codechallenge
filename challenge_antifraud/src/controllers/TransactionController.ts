'use strict';

import {DataBaseConnectionService} from "../services/DataBaseConnectionService";
import { ObjectLiteral } from "typeorm";
import {Success, Error} from "../helpers/SystemInterface";
import { Transaction } from "../models/transaction/Transaction";
import { TransactionStatus } from '../models/transaction/transactionStatus/TransactionStatus';
import { responseTransaction, kafkaFormat } from '../helpers/TransactionHelper';
import { getISODateNow } from '../helpers/SystemFuction';
import { KafkaConnection } from '../services/Kafka/KafkaConnection';
import {Consumer} from "kafkajs";

function createTransaction() {
    let dataBaseConnection2:DataBaseConnectionService = new DataBaseConnectionService(TransactionStatus),
        error:Error = {cod:500, message:'Error general del sistema' },
        success:Success = {cod:200, message:'Consulta exitosa', payload:{} },
        transaction:Transaction = new Transaction(),
        transactionStatus:TransactionStatus| ObjectLiteral | {} | null,
        kafkaConnection:KafkaConnection = new KafkaConnection();

        kafkaConnection.consumer().then((consumer:Consumer) => {
            consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log({
                        partition,
                        offset: message?.offset,
                        value: message?.value?.toString(),
                    });
                    if(message?.value?.toString()){
                        let {
                                transactionExternalId,
                                accountExternalIdDebit,
                                accountExternalIdCredit,
                                tranferTypeId,
                                value
                        } = JSON.parse(message?.value?.toString());
                        transaction.transactionExternalId = transactionExternalId;
                        transaction.accountExternalIdCredit =  accountExternalIdCredit;
                        transaction.accountExternalIdDebit = accountExternalIdDebit;
                        transaction.tranferTypeId = tranferTypeId;
                        transaction.value = value;
                        transaction = await transaction.save();
                        transactionStatus = await dataBaseConnection2.get('id', {id: transaction.tranferStatusId}, false);

                        let kafkaConnection2 = new KafkaConnection(kafkaFormat(
                            responseTransaction(transaction, transactionStatus),
                            'antifraud'));
                        await kafkaConnection2.producer();
                    }
                },
            })
        }).catch((error) => {
            console.error(error);
        })
    /*let dataBaseConnection2:DataBaseConnectionService = new DataBaseConnectionService(TransactionStatus),
        error:Error = {cod:500, message:'Error general del sistema' },
        success:Success = {cod:200, message:'Consulta exitosa', payload:{} },
        transaction:Transaction = new Transaction(),
        {transactionExternalId, accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value} = req.body,
        transactionStatus:TransactionStatus| ObjectLiteral | {} | null;

    try{
        transaction.transactionExternalId = transactionExternalId;
        transaction.accountExternalIdCredit =  accountExternalIdCredit;
        transaction.accountExternalIdDebit = accountExternalIdDebit;
        transaction.tranferTypeId = tranferTypeId;
        transaction.value = value;
        transaction = await transaction.save();
        transactionStatus = await dataBaseConnection2.get('id', {id: transaction.tranferStatusId}, false);

        res.status(success.cod).json(responseTransaction(transaction, transactionStatus));
    }catch (e){
        console.error(e);
        error.message = e;
        res.status(error.cod).json({
            transactionExternalId:transactionExternalId,
            transactionStatus: {id: 3,name: "Rejected"},
            createdAt: getISODateNow()}
        );
    }*/
}

export { createTransaction }