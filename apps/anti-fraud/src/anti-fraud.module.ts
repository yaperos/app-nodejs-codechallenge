import { Module } from '@nestjs/common';
import { DatabaseConfig, LoggerModule } from '@app/shared';
import { ValidateTransactionModule } from './validate-transaction/validate-transaction.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogValidateTransaction } from './validate-transaction/entities/validate-transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        entities: [LogValidateTransaction],
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    ValidateTransactionModule,
  ],
})
export class AntiFraudModule {}
