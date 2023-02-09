import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  validateValue(value: number): boolean {
    if (value > 1000) return false;
    return true;
  }
}
