import HttpException from './ HttpException';

class UnauthorizedException extends HttpException {
  constructor(message?: string) {
    super(401, message || 'Not authorized', 'UNAUTHORIZED_ERROR');
  }
}

export default UnauthorizedException;
