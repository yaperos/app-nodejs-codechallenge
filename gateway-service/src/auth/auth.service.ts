import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { createUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor() {}
  async createUser(data: createUserDto) {
    return data;
  }
}
