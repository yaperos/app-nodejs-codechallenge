import type DatabaseType from './enum/databaseType.enum'

export default interface DatabaseParams {
  type: DatabaseType
  host: string
  port: number
  password: string
  user: string
  database: string
}
