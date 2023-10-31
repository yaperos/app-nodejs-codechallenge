import ErrorMessagesConstants from '../../../shared/constants/errorMessages.constants'
import { logger } from '../../../shared/imports'
import type DatabaseParams from '../params/database.params'
import DatabaseTypeEnum from '../params/enum/databaseType.enum'

type DatabaseConfigurationStrategy = () => DatabaseParams

const databaseStrategies: { [key in DatabaseTypeEnum]: DatabaseConfigurationStrategy } = {
  [DatabaseTypeEnum.postgres]: postgresDatabaseConfigurationParams
}

function postgresDatabaseConfigurationParams (): DatabaseParams {
  const { DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PASSWORD } = process.env
  return {
    type: DatabaseTypeEnum.postgres,
    password: DB_PASSWORD ?? '',
    user: DB_USER ?? '',
    host: DB_HOST ?? '',
    database: DB_NAME ?? '',
    port: (DB_PORT != null) ? parseInt(DB_PORT) : 0
  } satisfies DatabaseParams
}

export function databaseConfigurationParams (dbType: DatabaseTypeEnum): DatabaseParams {
  const configurationStrategy = databaseStrategies[dbType]
  if (configurationStrategy === undefined) {
    const message: string = ErrorMessagesConstants.CONFIGURATION.DATABASE.MANAGER_NOT_FOUND
    logger.logError(message, 'DatabaseConfiguration.ts')
    throw new Error(message)
  }
  return configurationStrategy()
}
