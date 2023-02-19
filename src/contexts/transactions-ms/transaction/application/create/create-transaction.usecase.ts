import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Transaction } from '../../domain/transaction.model';
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
    ): Promise<Transaction> {
        const transaction = Transaction.fromCreateDto(createTransactionDto);
        return this.transactionRepository.save(transaction);
    }
}
