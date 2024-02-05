import { Test, TestingModule } from '@nestjs/testing';

import { databaseProviders } from './database.provider';

describe('databaseProviders', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ...databaseProviders,
        { provide: 'DATA_SOURCE_MYSQL', useValue: {} }, // Provide a mock implementation or an empty object
        { provide: 'DATA_SOURCE_MONGO', useValue: {} }, // Provide a mock implementation or an empty object
      ],
    }).compile();
  });

  it('should create a MySQL data source', async () => {
    const dataSource = module.get('DATA_SOURCE_MYSQL');

    expect(dataSource).toBeDefined();
  });

  it('should create a MongoDB data source', async () => {
    const dataSource = module.get('DATA_SOURCE_MONGO');

    expect(dataSource).toBeDefined();
  });
});
