import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import expressConfig from '@config/express.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [expressConfig],
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
