import {Injectable} from '@nestjs/common';
import {createUserDto} from './dto';

@Injectable()
export class AuthService {
  constructor() {
  }

  async createUser(data: createUserDto) {
    return data;
  }
}
