import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntifraudModule } from './antifraud/antifraud.module';
import { CustomConfigModule } from './common/config/custom-config';
import { AntifraudKafkaConfigService, TransactionKafkaConfigService } from './common/config/kafka';

@Module({
  imports: [
    CustomConfigModule,
    AntifraudModule,
  ],
  controllers: [AppController],
  providers: [AppService, AntifraudKafkaConfigService, TransactionKafkaConfigService],
})
export class AppModule {}
