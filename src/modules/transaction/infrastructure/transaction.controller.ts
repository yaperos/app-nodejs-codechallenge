import { Request, Response, NextFunction } from "express";
import { HttpCode } from "../../../helpers/domain/enums/http-code.enum";
import { TransactionUsecase } from "../application/transaction.usecase";
import { CreateTransactionRequestDto } from "../domain/interfaces/dtos/transaction-request.dto";

export class TransactionController {
    
    constructor(private readonly useCase: TransactionUsecase) {}

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body as CreateTransactionRequestDto;
            await this.useCase.createTransaction(data);
            
            res.status(HttpCode.CREATED).json({
                message: "Transaction created successfully"
            });
        } catch(e) {
            next(e);
        }
    }
}