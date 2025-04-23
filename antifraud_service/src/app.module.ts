import { Logger, Module } from '@nestjs/common';
import { ValidationModule } from './validation/validation.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    ValidationModule,
    KafkaModule
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule { }
