import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createDataSource } from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useFactory: () => createDataSource().options })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
