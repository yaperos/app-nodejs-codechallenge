import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export abstract class BaseDB {
  constructor(
    @InjectDataSource('db_yape') private readonly db_yape: DataSource,
  ) {}

  protected getDataSource() {
    return this.db_yape;
  }
}
