import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka';
import { FraudValidationModule } from './fraud-validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule,
    FraudValidationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
