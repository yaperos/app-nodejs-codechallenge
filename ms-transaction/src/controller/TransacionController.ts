import { Request,Response,RequestHandler } from 'express'
import TransactionDTO from '../domain/models/TransactionDTO'
import TransactionService from '../service/TransactionService'
import transactionSchema from '../domain/models/schemas/validation/TransactionValidation'

export default class TransactionController{
    //TODO change test
    private transactionService = new TransactionService();
    createTransaction: RequestHandler = async (req:Request, res:Response) => {
        transactionSchema.validate(req.body);
        console.log(req.body);
        const transaction = req.body as TransactionDTO;
        console.log(transaction.value);
        const transactionCreated = await this.transactionService.createTransaction(transaction);
        res.send(transactionCreated);
    }
}