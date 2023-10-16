import {Inject, Injectable} from '@nestjs/common'
import { ClientKafka } from "@nestjs/microservices"
import { TransactionRepository } from './ms-transactions.repository'
import { TransactionDocument } from "./ms-transactions.schema"
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { RetrieveTransactionDto } from './dto/retrieve-transaction.dto'
import { TransactionCreatedEvent } from './events/transaction-created.event'

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    @Inject('KAFKA_TRANSACTION_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction: TransactionDocument = await this.transactionRepository.create(createTransactionDto)

    const payload: TransactionCreatedEvent = new TransactionCreatedEvent(
      { transactionExternalId: transaction.transactionExternalId }
    )
    this.kafkaClient.emit('transaction_created', payload)
    console.log(`Emitting event transaction_created: ${payload}`)

    return new RetrieveTransactionDto({ ...transaction })
  }

  async update(payload: any) {
    const { transactionExternalId, status } = payload
    console.log(`Transaction ${transactionExternalId} status updated: ${status}`)
    await this.transactionRepository.findOneAndUpdate(
      { transactionExternalId }, { status }
    )
  }

  async findOne(transactionExternalId: string) {
    const retrievedDocument: TransactionDocument = await this.transactionRepository.findOne(
      { transactionExternalId }
    )
    return new RetrieveTransactionDto({ ...retrievedDocument })
  }

  findAll() {
    return this.transactionRepository.find({})
  }

  deleteAll() {
    return this.transactionRepository.deleteMany()
  }
}
