import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ITransaction } from './interface/transaction.interface';
import { GeneralResponse } from './dto/general-response.dto';
import { Model } from "mongoose";
import { MessagesResponses } from './util/message.util';
import { CodeResponses } from './util/const.util';

@Injectable()
export class AppRepository {
    constructor(@InjectModel('Transaction') private transactionModel: Model<ITransaction>) { }
   

    async updateTransactionStatus(transactionId: string, status): Promise<ITransaction> {
        const existingTransaction = await this.transactionModel.findByIdAndUpdate(transactionId, {status}, { new: true });
        if (!existingTransaction) {
            throw new GeneralResponse(MessagesResponses.TRANSACTION_NOT_FOUND,CodeResponses.ERROR);
        }
        return existingTransaction;
    }

   
}