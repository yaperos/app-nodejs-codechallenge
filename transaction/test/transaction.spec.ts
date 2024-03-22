import { ConfigModule } from "@nestjs/config";
import { AppModule } from "../src/app.module";
import { TransactionService } from "../src/transactions/app/transaction.service";
import { TransactionEntity } from "../src/transactions/domain/entities/transaction.entity";
import { TransactionRepository } from "../src/transactions/infra/repository/transactions.repository";
import { Test } from "@nestjs/testing";
import { ClientKafka } from "@nestjs/microservices";



describe('TransactionService', () =>{

    let transactionRepository
    let transactionService
    
    // console.log('sisas');
    
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule,ConfigModule,ClientKafka],
            providers: [TransactionRepository, TransactionService]
        }).compile();
        
        transactionService = module.get<TransactionService>(TransactionService);
        transactionRepository = module.get<TransactionRepository>(TransactionRepository);

        await module.close();

    });

    it('should be defined', () => {
        expect(transactionService).toBeDefined();
    });

    describe('create', () => {
        it('Should create a new transaction', async () => {

            const transactionData ={
                accountExternalIdDebit: 123456789,
                accountExternalIdCredit: 0,
                transferTypeId: 1,
                value: 321
            }

            const expectResult = new TransactionEntity();


            expectResult.accountExternalId = transactionData.accountExternalIdDebit;
            expectResult.status = 'PENDING';
            expectResult.transferTypeId = transactionData.transferTypeId;
            expectResult.typeAccount = 1
            expectResult.value = transactionData.value;

            jest.spyOn(transactionRepository, 'create').mockReturnValueOnce(expectResult);
            jest.spyOn(transactionRepository, 'save').mockResolvedValueOnce(expectResult);

            const result = await  transactionService.create(transactionData);

            expect(result).toBe(expectResult);

        })
    })
})