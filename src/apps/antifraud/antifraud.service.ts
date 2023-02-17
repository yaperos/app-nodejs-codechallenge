import { Injectable } from '@nestjs/common';

@Injectable()
export class AntifraudService {
  getHello(): string {
    return 'Hello World from Antifraud';
  }
}
