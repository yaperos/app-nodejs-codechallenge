import { describe, expect, test } from '@jest/globals'
import type DatabaseParams from '../../../core/db/params/database.params'
import { databaseConfigurationParams } from '../../../core/db/configuration/database.configuration'
import DatabaseTypeEnum from '../../../core/db/params/enum/databaseType.enum'
import ErrorMessagesConstants from '../../../shared/constants/errorMessages.constants'

describe('Test database configuration algorithm', () => {
  test('[HAPPY PATH] Test for returning postgres configuration params', () => {
    const dbType = DatabaseTypeEnum.postgres
    const params: DatabaseParams = databaseConfigurationParams(dbType)
    expect(params.type).toBe(dbType)
  })
  test('Test with unknown dbtype', () => {
    const dbType: any = 'mysql'
    expect(() => { databaseConfigurationParams(dbType) })
      .toThrowError(Error(ErrorMessagesConstants.CONFIGURATION.DATABASE.MANAGER_NOT_FOUND))
  })
})
