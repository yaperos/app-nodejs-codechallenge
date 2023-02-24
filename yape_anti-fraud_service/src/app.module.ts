import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntiFraudsModule } from './anti-frauds/anti-frauds.module';

@Module({
  imports: [AntiFraudsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
