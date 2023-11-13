import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { CLIENT_KAFKA, GROUP_KAFKA } from './app.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule.register({
      clientId: CLIENT_KAFKA.ID,
      brokers: [process.env.KAFKA_URL],
      groupId: GROUP_KAFKA.ID,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
