import {Inject, Injectable} from "@nestjs/common";
import {CreateTransactionInput} from "../../../common/dto/create_transaction_input";
import {TransactionRepository} from "./repository/transaction.repository";
import {TransactionLogRepository} from "./repository/transaction_log.repository";
import {ClientKafka} from "@nestjs/microservices";
import {ITransactionRepository} from "./repository/ITransactionRepository";
import {ITransactionLogRepository} from "./repository/ITransactionLogRepository";

@Injectable()
export class TransactionService {
    constructor(

        @Inject(TransactionRepository)
        private readonly transactionRepository: ITransactionRepository,
        @Inject(TransactionLogRepository)
        private readonly transactionLogRepository: ITransactionLogRepository,
        @Inject('KAFKA')
        private readonly kafka: ClientKafka,
        ) {}
    async createTransaction(transaction: CreateTransactionInput){

        try {
            const transactionResponse = await this.transactionRepository.createTransaction(transaction)

            this.transactionLogRepository.create(transaction,'success').then()

            this.kafka.send('transaction_created', JSON.stringify(transactionResponse)).subscribe( {
                error: (err) => {
                    this.transactionLogRepository.create(transactionResponse,'error')
                },
                next: (data) => {
                    console.log(data)
                    this.transactionRepository.updateTransaction(data)
                    this.transactionLogRepository.create(transactionResponse,'success')
                }
            })

            return transactionResponse
        } catch (e) {
            this.transactionLogRepository.create(transaction,'error').then()
        }

    }

    async findTransaction(externalId: string) {
        return this.transactionRepository.findTransaction(externalId)
    }

    onModuleInit() {
        this.kafka.subscribeToResponseOf('transaction_created');
    }
}