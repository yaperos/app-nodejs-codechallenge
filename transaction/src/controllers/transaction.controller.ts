import {Request, Response} from "express";

import {produce} from "../kafka/producer";
import {TransactionModel} from "../models/Transaction";
import {TransferTypeModel} from "../models/TransferType";

const createTransaction = async function(req: Request, res: Response) {
    try{
        // console.log('body', req.body)
        const {
            accountExternalIdDebit,
            accountExternalIdCredit,
            transferTypeId,
            value
        } = req.body;

        //VALIDAR QUE EL transferTypeId SEA VALIDO
        const existTransferType = await TransferTypeModel.findById(transferTypeId);
        if(!existTransferType){
            return res.status(404).json({"error": "No existe el transferType"})
        }        

        // SE CREA UN NUEVO MODELO DE LA TRANSACCIÓN
        const newTransaction = new TransactionModel({
            accountExternalIdCredit,
            accountExternalIdDebit,
            transferTypeId, 
            value,
        });


        // SE GUARDA LA TRANSACCION EN LA BASE DE DATOS
        const transactionSaved = await newTransaction.save();
        // SE FORMATEA LA TRANSACCION PARA MANDARLA AL PRODUCER
        const transationToSend = await transactionSaved.populate('transferTypeId')
        console.log('transationToSend', transationToSend)
        const messageTransaction = JSON.stringify(transationToSend);

        // ENVIA LA TRANSACCIÓN CREADA AL MICROSERVICIO 'ANTIFRAUD'
        produce(messageTransaction).catch((err)=> {
            console.log('Error:', err)
        } )

        return res.status(201).json({
            data: transactionSaved
        });
        
    } catch(err) {
        console.error('ERROR -> Transacción controller -> createTransaction:', err);
        return res.status(500).send({error: 'createTransaction -> Ocurrió un error interno en el servidor', err});
    }
}

const getTransactionByID = async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const transaction = await TransactionModel.findById(id);
        if(!transaction) {
            return res.status(404).send({message:"Transaction not found"});
        }
        return res.status(200).json({data:transaction});
    } catch(err) {
        console.error('ERROR -> Transacción controller -> getTransactionByID:', err);
        return res.status(500).send({error: err})
    } 
}

export {createTransaction, getTransactionByID}
