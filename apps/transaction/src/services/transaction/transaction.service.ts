import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return this.configService.get('DATABASE_URL');
  }
}
