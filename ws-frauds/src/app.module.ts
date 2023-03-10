import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FraudsModule } from './frauds/frauds.module';

@Module({
  imports: [FraudsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
