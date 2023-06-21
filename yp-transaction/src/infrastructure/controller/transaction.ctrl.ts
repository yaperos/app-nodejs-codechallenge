import { Request, Response } from "express";
import TransactionUseCase from "../../application/transaction.UseCase";
import TransactionEntity from "../../domain/transaction.entity";
import { badRequest, internalError, statusCreated, statusOk} from "../../libs/response"
import { CreateTransaction,FindTransactionById } from "../models/rest/transaction.model"

export default class TransactionController {
    constructor(private useCase: TransactionUseCase) {
    }

    createTransaction = async ({body}: Request, res: Response) => {
        try {
            const data = <TransactionEntity>body;
            const transact = await this.useCase.createTransaction(data);
            
            if(transact !== null){
                let response = new CreateTransaction(transact);
                statusCreated(response,res);
            } else {
                badRequest("Cannot create an user",res);
            }
        } catch(err: any) {
            internalError(err.message, res);
        }
    }

    findTransactionById = async ({params}: Request, res: Response) => {
        try {
            const { id } = params;

            const transact = await this.useCase.findTransactionById(id);
            if(transact !== null){
                statusOk(transact,res);
            } else {
                badRequest("Cannot retrieve the user",res);
            }
        } catch (err: any){
            internalError(err.message, res);
        }
    }
}