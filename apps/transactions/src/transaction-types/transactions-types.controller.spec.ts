import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '@/config/typeorm.config';
import { TransactionTypesController } from './transactions-types.controller';
import { TransactionTypesService } from './transactions-types.service';

describe('TransactionTypesController', () => {
  let controller: TransactionTypesController;

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
      controllers: [TransactionTypesController],
      providers: [TransactionTypesService],
    }).compile();

    controller = moduleRef.get<TransactionTypesController>(
      TransactionTypesController,
    );
  });

  describe('test initial data', () => {
    test.only('should check if exists 2 types of transaction types', async () => {
      let result = await controller.findAll();
      if (result.length == 0) {
        await controller.create({ transactionType: 'Yape' });
        await controller.create({ transactionType: 'Plin' });

        result = await controller.findAll();
      }

      expect(result.length).toBeGreaterThanOrEqual(2);
    });
  });
});
