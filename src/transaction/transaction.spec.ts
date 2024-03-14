import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { PrismaService } from '../prisma/prisma.service'; 

describe('TransactionService', () => {
    let transactionService: TransactionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TransactionService, PrismaService],
        }).compile();

        transactionService = module.get<TransactionService>(TransactionService);
    });

    it('should create a transaction and fetch it by ID', async () => {
        const createTransactionInput: CreateTransactionInput = {
            accountExternalIdDebit: 'Guid',
            accountExternalIdCredit: 'Guid',
            tranferTypeId: 1,
            value: 100,
        };
        const createdTransaction = await transactionService.create(createTransactionInput);
        const fetchedTransaction = await transactionService.getTransactionById(createdTransaction.id);
        expect(fetchedTransaction).toEqual(createdTransaction);
    });

    it('should fetch a transaction with nested data', async () => {
        const transactionId = 'Guid';
        const transaction = await transactionService.getTransactionById(transactionId);
        expect(transaction).toBeDefined();
    });

});
