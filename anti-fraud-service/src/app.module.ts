import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ValidateService } from './validate.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [ValidateService],
})
export class AppModule {}
