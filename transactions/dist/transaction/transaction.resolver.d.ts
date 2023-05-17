import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
export declare class TransactionResolver {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    createTransaction(createTransactionInput: CreateTransactionInput): Promise<Transaction>;
    findById(transactionId: string): Promise<Transaction>;
}
