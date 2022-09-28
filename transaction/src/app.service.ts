import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Connection, createConnection } from 'typeorm';
import { COMMAND_DATABASE_CONNECTION, COMMAND_DATABASE_URL, KAFKA_BROKERS, KAFKA_CLIENT_ID, KAFKA_GROUP_ID } from './infrastructure/constants';
import { TransactionEntity } from './infrastructure/entity/transaction.entity';

class DBConfig {
  readonly url: string;
  readonly synchronize: boolean;
  readonly logging: boolean;
  readonly name: string;
  readonly type: string;
}

export class KafkaConfig {
  readonly groupId: string;
  readonly clientId: string;
  readonly brokers: Array<string>;
}

export class AppService implements OnModuleInit, OnModuleDestroy {
  private databaseConnection?: Connection | void;

  static port(): number {
    const { PORT } = process.env;
    return PORT && Number(PORT) ? Number(PORT) : 5000;
  }

  static KafkaConfig(): KafkaConfig {
    return {
      groupId: KAFKA_GROUP_ID,
      clientId: KAFKA_CLIENT_ID,
      brokers: [KAFKA_BROKERS],
    };
  }

  async onModuleInit(): Promise<void> {
    const entities = [TransactionEntity];

    this.databaseConnection = await createConnection({
      ...this.loadDBConfig(),
      type: 'mongodb',
      entities,
    }).catch((error: Error) => this.failToConnectDatabase(error));
  }

  private loadDBConfig(): DBConfig {
    return {
      name: COMMAND_DATABASE_CONNECTION,
      type: 'mongodb',
      url: COMMAND_DATABASE_URL,
      synchronize: 'true' === process.env.DATABASE_SYNC || true,
      logging: 'true' === process.env.DATABASE_LOGGING || true,
    };
  }

  private failToConnectDatabase(error: Error): void {
    console.error(error);
    process.exit(1);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.databaseConnection) await this.databaseConnection.close();
  }
}
