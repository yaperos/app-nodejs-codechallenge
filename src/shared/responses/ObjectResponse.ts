import BaseResponse from './BaseResponse'

export default class ObjectResponse extends BaseResponse {
  constructor(
      message: string,
        private data: object | null,
        error?: boolean,
  ) {
    super(message, error);
    this.data = data;
  }
}
