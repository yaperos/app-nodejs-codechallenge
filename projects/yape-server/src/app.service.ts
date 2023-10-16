import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to the Backend api project of Jose Agraz - Joseagraz29@gmail.com';
  }
}
