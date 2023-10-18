import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as process from 'process';
import { DataSourceEnum } from '../config/DataSourceEnum';

export abstract class BaseDB {
  // constructor(
  //   @InjectDataSource(DataSourceEnum.db_yape)
  //   private readonly db_yape: DataSource,
  // ) {}
  @InjectDataSource(DataSourceEnum.db_yape)
  readonly db_yape: DataSource;

  protected getDataSource() {
    return this.db_yape;
  }
}
