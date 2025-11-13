import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { HttpModule } from '@adapters/http/http.module';
import { MessagingModule } from '@adapters/messaging/messaging.module';
import { InfraModule } from '@infra/infra.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    HttpModule,
    MessagingModule,
    InfraModule,
  ],
})
export class AppModule {}
