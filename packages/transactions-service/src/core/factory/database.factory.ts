import { type DataSource } from 'typeorm'
import { databaseConfigurationParams } from '../db/configuration/database.configuration'
import { type Database } from '../db/database'
import { PostgresDatabaseInstance } from '../db/instances/postgresDatabase.instance'
import type DatabaseParams from '../db/params/database.params'
import DatabaseTypeEnum from '../db/params/enum/databaseType.enum'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DatabaseFactory {
  public static getPostgreSqlInstance (): Database<DataSource> {
    const configuration: DatabaseParams = databaseConfigurationParams(DatabaseTypeEnum.postgres)
    return new PostgresDatabaseInstance(configuration)
  }
}
