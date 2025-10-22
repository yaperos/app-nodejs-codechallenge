import { DataSource } from 'typeorm';
import { TransactionEntity } from '../../../src/infrastructure/database/entities/transaction.entity';
import { TransactionStatus, TransactionType } from '../../../src/domain/entities/transaction.entity';

export class TestDatabaseHelper {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'yape_user',
      password: process.env.DB_PASSWORD || 'yape_password123',
      database: process.env.DB_DATABASE || 'yape_transactions',
      entities: [TransactionEntity],
      synchronize: true,
      dropSchema: false,
      logging: false,
      extra: {
        max: 5,
        min: 1,
        idleTimeoutMillis: 5000,
      },
    });
  }

  async connect(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }

  async disconnect(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }

  async cleanDatabase(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.connect();
    }

    const entities = this.dataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = this.dataSource.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async createTestTransaction(data: Partial<TransactionEntity> = {}): Promise<TransactionEntity> {
    const repository = this.dataSource.getRepository(TransactionEntity);
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const transaction = repository.create({
      externalId: data.externalId || `test-${uniqueId}`,
      idempotencyKey: data.idempotencyKey || `idempotency-${uniqueId}`,
      type: data.type || TransactionType.P2P,
      status: data.status || TransactionStatus.PENDING,
      amount: data.amount || 100,
      currency: data.currency || 'PEN',
      sourceAccountId: data.sourceAccountId || `account-${uniqueId}`,
      targetAccountId: data.targetAccountId || `dest-${uniqueId}`,
      metadata: data.metadata || {},
      retryCount: data.retryCount || 0,
      ...data,
    });

    return await repository.save(transaction);
  }

  async getTransactionById(id: string): Promise<TransactionEntity | null> {
    const repository = this.dataSource.getRepository(TransactionEntity);
    return await repository.findOne({ where: { id } });
  }

  async getAllTransactions(): Promise<TransactionEntity[]> {
    const repository = this.dataSource.getRepository(TransactionEntity);
    return await repository.find();
  }
}
