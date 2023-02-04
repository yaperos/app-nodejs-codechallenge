import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumerService } from './kafka/consumer.service';
import { KafkaModule } from './kafka/kafka.module';
import { Transaction } from './transaction/entity/transaction.entity';
import { TransactionModule } from './transaction/transaction.module';
import { TransactionService } from './transaction/transaction.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Transaction],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TransactionModule,
    KafkaModule,
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [AppController],
  providers: [AppService, ConsumerService, TransactionService],
})
export class AppModule {}
