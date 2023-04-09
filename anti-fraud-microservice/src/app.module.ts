import { Module } from '@nestjs/common';
import { AppService } from './application/app.service';
import { AppController } from './infrastructure/app.controller';

@Module({
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
