import {Inject, Injectable, Logger, NotFoundException, OnModuleInit} from '@nestjs/common';
import {ClientKafka} from "@nestjs/microservices";
import {InjectRepository} from "@nestjs/typeorm";
import {Transaction, TransactionStatus} from "./entities";
import {Repository} from "typeorm";
import {CreateTransactionDto} from "./dtos/create.transaction";
import {serialize} from "./utils";

@Injectable()
export class TransactionService implements OnModuleInit {
    constructor(@Inject('ANTI_FRAUD') private readonly _client: ClientKafka,
                @InjectRepository(Transaction) private readonly _transactionRepository: Repository<Transaction>
    ) {}

    onModuleInit(): any {
        this._client.subscribeToResponseOf('transaction')
    }

    async findOne(id: string) {
        const transaction = await this._transactionRepository.findOneBy({id});

        if (!transaction) throw new NotFoundException(`Transaction with ID #${id} not found`);

        return serialize(transaction);
    }

    async create(createTransaction: CreateTransactionDto) {
        const transaction = await this._transactionRepository.save(createTransaction);
        console.log('is going to validate');
        this.antiFraudValidation(transaction);

        return serialize(transaction);
    }

    async updateStatus(id: string, status: TransactionStatus) {
        return this._transactionRepository.update({id}, {status});
    }

    private antiFraudValidation(createTransaction: CreateTransactionDto) {
        console.log('validation starts');
        this._client.send('transaction', JSON.stringify(createTransaction))
            .subscribe((validatedTransaction) => {
                console.log(`Anti fraud validation: ${JSON.stringify(validatedTransaction)}`);
                this.updateStatus(validatedTransaction.id, validatedTransaction.status);
            })
    }
}
