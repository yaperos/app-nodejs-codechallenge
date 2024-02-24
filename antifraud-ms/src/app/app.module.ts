import { Module } from '@nestjs/common';
import { AntiFraudModule } from './module/antifraud.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AntiFraudModule
  ]
})
export class AppModule {}
