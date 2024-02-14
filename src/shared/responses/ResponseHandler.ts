import BaseResponse from './BaseResponse';

export default class ResponseHandler<R> {
  public handle(response: R) {
    return response
  }

  public handleException(error: R, baseResponse: BaseResponse) {
    return {
      message: baseResponse._message,
      error: baseResponse._error,
      data: error,
    }
  }
}
