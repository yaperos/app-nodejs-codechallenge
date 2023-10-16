import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceModule } from './balance/balance.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AccountsModule,
    BalanceModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoLoadEntities: true,
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        synchronize: process.env.NODE_ENV !== 'production',
      }),
    }),
  ],
})
export class AppModule {}
