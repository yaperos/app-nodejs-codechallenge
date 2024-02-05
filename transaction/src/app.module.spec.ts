import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppModule } from './app.module';
import { HealthModule } from './modules/health/health.module';
import { TransactionModule } from './modules/transaction/infrastructure/presentation/transaction.module';

@Module({})
class TestTransactionModule {}

describe('AppModule', () => {
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(TransactionModule)
      .useModule(TestTransactionModule)
      .compile();
  });

  it('should import the GraphQLModule', () => {
    const graphQLModule = testingModule.get<GraphQLModule>(GraphQLModule);

    expect(graphQLModule).toBeDefined();
  });

  it('should import the TransactionModule', () => {
    const transactionModule = testingModule.get<TestTransactionModule>(
      TestTransactionModule,
    );

    expect(transactionModule).toBeDefined();
  });

  it('should import the HealthModule', () => {
    const healthModule = testingModule.get<HealthModule>(HealthModule);

    expect(healthModule).toBeDefined();
  });

  it('should import the ThrottlerModule', () => {
    const throttlerModule = testingModule.get<ThrottlerModule>(ThrottlerModule);

    expect(throttlerModule).toBeDefined();
  });

  it('should import the ConfigModule', () => {
    const configModule = testingModule.get<ConfigModule>(ConfigModule);

    expect(configModule).toBeDefined();
  });
});
