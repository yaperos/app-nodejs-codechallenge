import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Transaction MS!';
  }
}
