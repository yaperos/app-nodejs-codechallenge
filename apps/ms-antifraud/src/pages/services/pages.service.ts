import { Injectable } from '@nestjs/common';

@Injectable()
export class PagesService {
  getHello(): string {
    return 'Hello World!';
  }
}
