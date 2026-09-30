import { MessagingModule } from '@app/messaging';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MessagingModule.forRoot('anti-fraud-service'),
  ],
})
export class AntiFraudModule {}
