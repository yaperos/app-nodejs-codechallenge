import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async validateAmount(amount: number): Promise<boolean> {
    const maxAmount = 1000;
    return amount < maxAmount;
  }
}
