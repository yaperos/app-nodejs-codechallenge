import { Model, Types } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AbstractRepository } from '@app/common'
import { TransactionDocument } from './ms-transactions.schema'
import { TransactionStatus } from './ms-transactions.constants'
import { CreateTransactionDto } from './dto/create-transaction.dto'

@Injectable()
export class TransactionRepository extends AbstractRepository<TransactionDocument> {
    constructor(
        @InjectModel(TransactionDocument.name) transactionModel: Model<TransactionDocument>
    ) {
        super(transactionModel)
    }

    async create(createTransactionDto: CreateTransactionDto): Promise<TransactionDocument> {
        const transactionExternalId: Types.ObjectId = new Types.ObjectId()
        return await super.create({
            ...createTransactionDto,
            transactionExternalId,
            createdAt: new Date(),
            status: TransactionStatus.PENDING
        })
    }
}
