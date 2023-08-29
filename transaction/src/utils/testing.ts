import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TestingUtil {
  private dataSource: DataSource;
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }
  public async cleanDataBase() {
    try {
      const tableNames = this.dataSource.entityMetadatas
        .map((entity) => entity.tableName)
        .join(', ');
      await this.dataSource.query(
        `truncate ${tableNames} restart identity cascade;`,
      );
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`);
    }
  }
}
