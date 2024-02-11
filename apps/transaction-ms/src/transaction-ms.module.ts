import { Module } from '@nestjs/common';
import { TransactionMsController } from './transaction-ms.controller';
import { TransactionMsService } from './transaction-ms.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionStatus } from './entities/transaction-status.entity';
import { TransactionType } from './entities/transaction-type.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST', 'localhost'),
        port: +configService.get('POSTGRES_PORT', '3306'),
        username: configService.get('POSTGRES_USER', 'postgres'),
        password: configService.get('POSTGRES_PASSWORD', 'postgres'),
        database: configService.get(
          'POSTGRES_DATABASE',
          'app-nodejs-codechallenge',
        ),
        autoLoadEntities: true,
        entities: ['dist/**/*.entity{.ts,.js}'],
        logging: configService.get('POSTGRES_LOGGING') === 'true',
        bigNumberStrings: false,
        supportBigNumbers: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Transaction, TransactionType, TransactionStatus]),
  ],
  controllers: [TransactionMsController],
  providers: [TransactionMsService],
})
export class TransactionMsModule {}
