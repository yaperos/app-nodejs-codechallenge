import { Test, TestingModule } from '@nestjs/testing';
import { TransactionModule } from './transaction.module';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionServiceImpl } from '../application/services/transaction.service';
import { TransactionRepositoryImpl } from './repositories/kafka/transaction.repository';
import { CoreModule } from 'src/shared/core.module';

describe('TransactionModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CoreModule, TransactionModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide TransactionController', () => {
    const controller = module.get<TransactionController>(TransactionController);
    expect(controller).toBeDefined();
  });

  it('should provide TransactionServiceImpl', () => {
    const service = module.get<TransactionServiceImpl>('TransactionService');
    expect(service).toBeDefined();
  });

  it('should provide TransactionRepositoryImpl', () => {
    const repository = module.get<TransactionRepositoryImpl>(
      'TransactionRepository',
    );
    expect(repository).toBeDefined();
  });
});
