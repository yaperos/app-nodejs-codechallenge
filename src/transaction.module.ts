import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Domain
import { CreateTransactionUseCase } from '@domain/use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from '@domain/use-cases/get-transaction.use-case';
import { UpdateTransactionStatusUseCase } from '@domain/use-cases/update-transaction-status.use-case';
import { TransactionRepositoryPort } from '@domain/ports/transaction-repository.port';
import { AntiFraudPort } from '@domain/ports/anti-fraud.port';
import { LoggerPort } from '@domain/ports/logger.port';

// Application
import { CreateTransactionHandler } from '@application/handlers/create-transaction.handler';
import { GetTransactionHandler } from '@application/handlers/get-transaction.handler';
import { AntiFraudService } from '@application/services/anti-fraud.service';

// Infrastructure
import { TransactionController } from '@infrastructure/controllers/transaction.controller';
import { TransactionOrmEntity } from '@infrastructure/adapters/persistence/entities/transaction.entity';
import { TransactionTypeOrmEntity } from '@infrastructure/adapters/persistence/entities/transaction-type.entity';
import { TransactionStatusOrmEntity } from '@infrastructure/adapters/persistence/entities/transaction-status.entity';
import { TransactionRepositoryAdapter } from '@infrastructure/adapters/persistence/transaction-repository.adapter';
import { KafkaAntiFraudAdapter } from '@infrastructure/adapters/messaging/kafka-anti-fraud.adapter';
import { WinstonLoggerAdapter } from '@infrastructure/adapters/logging/winston-logger.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionOrmEntity,
      TransactionTypeOrmEntity,
      TransactionStatusOrmEntity,
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    // Logger
    {
      provide: 'LoggerPort',
      useClass: WinstonLoggerAdapter,
    },
    
    // Repository
    {
      provide: 'TransactionRepositoryPort',
      useClass: TransactionRepositoryAdapter,
    },
    
    // Anti-Fraud Service
    {
      provide: 'AntiFraudPort',
      useClass: KafkaAntiFraudAdapter,
    },
    
    // Use Cases
    CreateTransactionUseCase,
    GetTransactionUseCase,
    UpdateTransactionStatusUseCase,
    
    // Handlers
    CreateTransactionHandler,
    GetTransactionHandler,
    
    // Services
    AntiFraudService,
  ],
  exports: [
    'LoggerPort',
    'TransactionRepositoryPort',
    'AntiFraudPort',
  ],
})
export class TransactionModule implements OnModuleInit {
  constructor(
    private readonly antiFraudService: AntiFraudService,
    @Inject('AntiFraudPort') private readonly antiFraudPort: AntiFraudPort,
  ) {}

  async onModuleInit() {
    // Configurar consumidor Kafka para actualizaciones de estado de transacción
    await this.antiFraudPort.onTransactionStatusUpdated(
      (event) => this.antiFraudService.processTransactionStatusUpdate(event),
    );
  }
} 