import type DatabaseParams from './params/database.params'

export abstract class Database<T> {
  private readonly configuration: DatabaseParams | undefined

  constructor (configuration: DatabaseParams) {
    this.configuration = configuration
  }
  public abstract start (): Promise<T>
  public abstract getDataSource (): T
}
