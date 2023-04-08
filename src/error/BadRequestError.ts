export class BadRequestError {
  private _httpStatus: number;
  private _messages: string[];
  private _data: any;

  public get httpStatus(): number {
    return this._httpStatus;
  }

  public get message(): string[] {
    return this._messages;
  }

  public get data(): any {
    return this._data;
  }

  constructor(httpStatus: number, messages: string[], data?: any) {
    if (data) {
      this._data = data;
    }

    this._messages = messages;
    this._httpStatus = httpStatus;
  }
}
