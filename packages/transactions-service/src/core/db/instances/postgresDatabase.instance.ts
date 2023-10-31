import { DataSource } from 'typeorm'
import { Database } from '../database'
import type DatabaseParams from '../params/database.params'
import TransactionModel from '../models/typeorm/transactionModel.model'
import { logger } from '../../../shared/imports'

export class PostgresDatabaseInstance extends Database<DataSource> {
  private readonly _datasource: DataSource

  constructor (params: DatabaseParams) {
    super(params)
    this._datasource = new DataSource({
      type: 'postgres',
      username: params.user,
      password: params.password,
      host: params.host,
      port: params.port,
      database: params.database,
      entities: [TransactionModel],
      synchronize: true,
      logging: false
    })
  }

  public async start (): Promise<DataSource> {
    try {
      const result = await this._datasource.initialize()
      logger.logDebug('Database instance connected. ', 'PostgresDatabaseInstance.ts')
      return result
    } catch (error: any) {
      logger.logError(error, 'PostgresDatabaseInstance.ts')
      throw error
    }
  }

  public getDataSource (): DataSource {
    return this._datasource
  }
}
