import {NextFunction, Request, Response} from "express";
import {Error} from "../helpers/SystemInterface";
import validator from 'validator';
import { DataBaseConnectionService } from '../services/DataBaseConnectionService';
import { TransactionType } from '../models/transaction/transactionType/TransactionType';
import {ObjectLiteral} from "typeorm";

async function validationTransaction(req:Request, res:Response, next:NextFunction){
    let { accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value } = req.body,
         validationTransationType:boolean;

    if(accountExternalIdDebit &&
       tranferTypeId &&
       value ||
       accountExternalIdCredit &&
       tranferTypeId &&
       value){
        let validationDebitCredit:boolean = false;
        if(accountExternalIdDebit){
            validationDebitCredit = validator.isUUID(accountExternalIdDebit.toString())
        }else{
            if(accountExternalIdCredit){
                validationDebitCredit = validator.isUUID(accountExternalIdCredit.toString())
            }
        }
        if(validationDebitCredit &&
           validator.isInt(tranferTypeId.toString()) &&
           validator.isInt(value.toString())){
            validationTransationType = await validationTransactionTypeDB(tranferTypeId);
            if(validationTransationType){
                next();
            }else{
                let error:Error = {
                    cod: 403,
                    message: 'Error ocurrido en la validacion del tranferTypeId no existe dentro de la base de datos'
                };
                res.status(error.cod).json(error);
            }
        }else{
            if(accountExternalIdDebit){
                if(!validator.isUUID(accountExternalIdDebit.toString())){
                    let error:Error = {
                        cod: 403,
                        message: 'Error ocurrido en la validacion del accountExternalIdDebi debe ser de tipo UUID'
                    };
                    res.status(error.cod).json(error);
                }
            }

            if(accountExternalIdCredit){
                if(!validator.isUUID(accountExternalIdCredit.toString())){
                    let error:Error = {
                        cod: 403,
                        message: 'Error ocurrido en la validacion del accountExternalIdCredit debe ser de tipo UUID'
                    };
                    res.status(error.cod).json(error);
                }
            }

            if(!validator.isInt(tranferTypeId.toString())){
                let error:Error = {
                    cod: 403,
                    message: 'Error ocurrido en la validacion del tranferTypeId debe ser de tipo Numerico'
                };
                res.status(error.cod).json(error);
            }

            if(!validator.isInt(value.toString())){
                let error:Error = {
                    cod: 403,
                    message: 'Error ocurrido en la validacion del value debe ser de tipo Numerico'
                };
                res.status(error.cod).json(error);
            }
        }
    }else{
        if(!accountExternalIdDebit && !accountExternalIdCredit){
            let error:Error = {
                cod: 403,
                message: 'Error ocurrido en la validacion del accountExternalIdDebi y accountExternalIdCredit debe existir uno'
            };
            res.status(error.cod).json(error);
        }

        if(!accountExternalIdDebit){
            let error:Error = {
                cod: 403,
                message: 'Error ocurrido en la validacion del accountExternalIdDebi debe existir en la consulta'
            };
            res.status(error.cod).json(error);
        }

        if(!accountExternalIdCredit){
            let error:Error = {
                cod: 403,
                message: 'Error ocurrido en la validacion del accountExternalIdCredit debe existir en la consulta'
            };
            res.status(error.cod).json(error);
        }

        if(!tranferTypeId){
            let error:Error = {
                cod: 403,
                message: 'Error ocurrido en la validacion del tranferTypeId debe existir en la consulta'
            };
            res.status(error.cod).json(error);
        }

        if(!value){
            let error:Error = {
                cod: 403,
                message: 'Error ocurrido en la validacion del value debe existir en la consulta'
            };
            res.status(error.cod).json(error);
        }
    }
}

async function validationTransactionTypeDB(tranferTypeId:number){
    let dataBaseConnectionService:DataBaseConnectionService = new DataBaseConnectionService(TransactionType),
        transactionType:TransactionType | ObjectLiteral | {} | null,
        validationData:boolean = false;

    transactionType = await dataBaseConnectionService.get("",{id: tranferTypeId},false);
    if(transactionType){
        validationData = true;
    }

    return validationData;
}

export { validationTransaction }