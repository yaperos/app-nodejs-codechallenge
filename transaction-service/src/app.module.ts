import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { PingController } from './ping.controller';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { TypesModule } from './modules/types/types.module';
import { EventsModule } from './modules/events/events.module';

const configService = new ConfigService();
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      configService.get('MONGODB_URI') ||
        `mongodb://root:password123@localhost:27017/yape?authSource=admin&readPreference=primary`,
      {
        autoIndex: true,
      },
    ),
    TransactionsModule,
    TypesModule,
    EventsModule,
  ],
  controllers: [PingController],
  providers: [],
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = +this.configService.get('PORT') || 3000;
  }
}
