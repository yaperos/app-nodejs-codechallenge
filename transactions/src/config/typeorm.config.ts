import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { FinancialTransaction } from '@/transactions/entities/financial-transaction.entity';
import { FinancialTransactionType } from '@/transactions/entities/financial-transaction-type.entity';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities: TypeOrmConfig.financialTransactionEntities,
      synchronize: true,
      logging: false,
    };
  }

  static financialTransactionEntities = [
    FinancialTransaction,
    FinancialTransactionType,
  ];
}
