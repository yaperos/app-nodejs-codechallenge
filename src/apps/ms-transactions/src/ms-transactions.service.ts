import {Inject, Injectable} from '@nestjs/common'
import { ClientKafka } from "@nestjs/microservices"
import { Types } from 'mongoose'
import { TransactionRepository } from './ms-transactions.repository'
import { TransactionStatus } from './ms-transactions.constants'
import { TransactionDocument } from "./ms-transactions.schema"
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { TransactionCreatedEvent } from './events/transaction-created.event'

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    @Inject('transaction-service')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction: TransactionDocument = await this.transactionRepository.create({
      ...createTransactionDto,
      createdAt: new Date(),
      transactionExternalId: new Types.ObjectId(),
      status: TransactionStatus.PENDING
    })

    const payload: TransactionCreatedEvent = new TransactionCreatedEvent(
      { transactionId: transaction.transactionExternalId, status: transaction.status }
    )
    console.log(`Sending event ${payload}`)
    this.kafkaClient.emit('transaction_created', payload)

    return transaction
  }

  update(updateTransactionDto: UpdateTransactionDto) {
    const { transactionId, status } = updateTransactionDto
    return this.transactionRepository.findOneAndUpdate(
      {transactionId}, {status}
    )
  }

  findOne(transactionId: string) {
    return this.transactionRepository.findOne({transactionId})
  }

  findAll() {
    return this.transactionRepository.find({})
  }

  deleteAll() {
    return this.transactionRepository.deleteMany()
  }
}
