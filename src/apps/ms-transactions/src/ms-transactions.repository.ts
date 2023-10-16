import { Model } from "mongoose"
import { Injectable } from "@nestjs/common"
import {InjectModel} from "@nestjs/mongoose"
import { AbstractRepository } from "@app/common"
import { TransactionDocument } from "./ms-transactions.schema"

@Injectable()
export class TransactionRepository extends AbstractRepository<TransactionDocument> {
    constructor(
        @InjectModel(TransactionDocument.name) transactionModel: Model<TransactionDocument>
    ) {
        super(transactionModel)
    }
}
