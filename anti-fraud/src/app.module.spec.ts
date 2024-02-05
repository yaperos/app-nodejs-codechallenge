import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './app.module';
import { HealthModule } from './modules/health/health.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { TransactionKafkaService } from './modules/transaction/infrastructure/services/transaction-kafka.service';

class KafkaServiceMock {}

@Module({
  providers: [{ provide: 'KafkaService', useClass: KafkaServiceMock }],
  exports: ['KafkaService'],
})
class TestKafkaModule {}

describe('AppModule', () => {
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TransactionKafkaService)
      .useValue({})
      .compile();
  });

  it('should import the KafkaModule', () => {
    const kafkaModule = testingModule.get<KafkaModule>(KafkaModule);

    expect(kafkaModule).toBeDefined();
  });

  it('should import the HealthModule', () => {
    const healthModule = testingModule.get<HealthModule>(HealthModule);

    expect(healthModule).toBeDefined();
  });

  it('should import the ConfigModule', () => {
    const configModule = testingModule.get<ConfigModule>(ConfigModule);

    expect(configModule).toBeDefined();
  });
});
