import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TransactionModel } from '../../domain/transaction.model';
import { TransactionRepository } from '../../domain/transaction.repository';
import { CreateTransactionDto } from '../../infraestructure/dtos/create-transaction.dto';

@Injectable()
export class CreateTransactionUsecase {
    constructor(
        @Inject(TransactionRepository)
        private readonly transactionRepository: TransactionRepository,
    ) {}

    public createTransaction(
        createTransactionDto: CreateTransactionDto,
    ): Promise<TransactionModel> {
        const transaction =
            TransactionModel.fromCreateDto(createTransactionDto);
        return this.transactionRepository.save(transaction);
    }
}
