export default class HttpError extends Error {
  private readonly _status: number
  private readonly _description: string

  constructor (error: string, description: string, status: number) {
    super(error)
    this._description = description
    this._status = status
  }

  public get description (): string {
    return this._description
  }

  public get status (): number {
    return this._status
  }
}
