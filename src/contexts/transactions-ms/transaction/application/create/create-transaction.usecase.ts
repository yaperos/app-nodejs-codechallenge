import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionModel } from '../../domain/transaction.model';
import { TransactionRepository } from '../../domain/transaction.repository';
import { CreateTransactionDto } from '../../infraestructure/dtos/create-transaction.dto';

@Injectable()
export class CreateTransactionUsecase {
    constructor(
        @Inject(TransactionRepository)
        private readonly transactionRepository: TransactionRepository,
        @Inject('TRANSACTION_CREATED_SERVICE')
        private readonly clientKafa: ClientKafka,
    ) {}

    public async createTransaction(
        createTransactionDto: CreateTransactionDto,
    ): Promise<TransactionModel> {
        const transaction =
            TransactionModel.fromCreateDto(createTransactionDto);
        const transactionCreated = await this.transactionRepository.save(
            transaction,
        );

        this.clientKafa
            .send('transaction_created', JSON.stringify(transactionCreated))
            .subscribe((response) => {
                console.log('REPSONSEEE', response);
            });

        return transactionCreated;
    }

    onModuleInit() {
        this.clientKafa.subscribeToResponseOf('transaction_created');
    }
}
