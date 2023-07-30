import { Injectable, Scope } from '@nestjs/common';
import { DbTransactionPort } from 'src/domain/_shared/ports/db-transaction-port';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmTransactionAdapter implements DbTransactionPort {
  public queryRunner: QueryRunner;
  private shouldKeepAlive = false;
  constructor(private readonly dataSource: DataSource) {
    this.queryRunner = this.dataSource.createQueryRunner();
  }

  async startTransaction(shouldKeepAlive?: boolean): Promise<boolean> {
    if (!this.queryRunner.isTransactionActive) {
      await this.queryRunner.startTransaction();
    }
    if (shouldKeepAlive) {
      this.shouldKeepAlive = shouldKeepAlive;
    }
    return this.shouldKeepAlive;
  }

  async commitTransaction(): Promise<void> {
    if (this.queryRunner.isTransactionActive) {
      await this.queryRunner.commitTransaction();
    }
  }

  async rollbackTransaction(): Promise<void> {
    if (this.queryRunner.isTransactionActive) {
      await this.queryRunner.rollbackTransaction();
    }
  }

  async release(): Promise<void> {
    await this.queryRunner.release();
  }
}

export const typerOrmTransactionProvider = {
  provide: DbTransactionPort,
  useClass: TypeOrmTransactionAdapter,
};
