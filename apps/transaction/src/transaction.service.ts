import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionService {
  @Inject()
  private readonly configService: ConfigService;

  getHello(): string {
    return `Hello ${this.configService.getOrThrow<string>('DATABASE_URL')}!`;
  }
}
