import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MessagingModule } from '@adapters/messaging/messaging.module';
import { ApplicationModule } from '@application/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ApplicationModule,
    MessagingModule,
  ],
  providers: [Logger],
})
export class AppModule {}
