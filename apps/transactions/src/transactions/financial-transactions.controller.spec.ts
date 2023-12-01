import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '@/config/typeorm.config';
import { FinancialTransactionsController } from '@/transactions/financial-transactions.controller';
import { FinancialTransactionsService } from '@/transactions/financial-transactions.service';
import { CreateFinancialTransactionDTO } from '@/transactions/dto/create-financial-transaction.dto';

describe('FinancialTransactionsController', () => {
  let controller: FinancialTransactionsController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.local', '.env'],
        }),
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfig,
        }),
        TypeOrmModule.forFeature(TypeOrmConfig.financialTransactionEntities),
      ],
      controllers: [FinancialTransactionsController],
      providers: [FinancialTransactionsService],
    }).compile();

    controller = moduleRef.get<FinancialTransactionsController>(
      FinancialTransactionsController,
    );
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const result = await controller.findAll();

      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  let id = 0;
  describe('create', () => {
    it('should add 1 transaction', async () => {
      const transaction: CreateFinancialTransactionDTO = {
        accountExternalIdDebit: crypto.randomUUID(),
        accountExternalIdCredit: crypto.randomUUID(),
        tranferTypeId: 1,
        value: 120,
      };

      id = await controller.create(transaction);

      expect(id).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getOne', () => {
    it('should return 1 transaction', async () => {
      const transaction = await controller.getOne(id);

      expect(transaction).not.toBeFalsy();
    });
  });
});
