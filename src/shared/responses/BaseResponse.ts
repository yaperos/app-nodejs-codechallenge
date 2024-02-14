export default class BaseResponse {
  constructor(
        private message: string,
        private error?: boolean) {
    this.message = message;
    this.error = error ? error : false;
  }

  get _message(): string {
    return this.message
  }
  set _message(value: string) {
    this.message = value
  }
  get _error(): boolean | undefined {
    return this.error
  }
  set _error(value: boolean | undefined) {
    this.error = value
  }
}
