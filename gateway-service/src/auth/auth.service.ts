import { Injectable } from '@nestjs/common';
import { createUserDto, loginUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor() {}

  async createUser(data: createUserDto) {
    const request = data.requestId;
    delete data.requestId;
    return {
      requestID: request,
      payload: {
        ...data,
      },
    };
  }

  async login(data: loginUserDto) {
    const request = data.requestId;
    delete data.requestId;
    return {
      requestID: request,
      payload: {
        ...data,
      },
    };
  }

  async verify(data: any) {
    const request = data.requestId;
    delete data.requestId;
    return {
      requestID: request,
      payload: {
        ...data,
      },
    };
  }
}
