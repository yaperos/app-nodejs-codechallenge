import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ValidateTransactionController } from './antifraud/infrastructure/controllers/validate-transaction.controller';
import { ValidateTransactionService } from './antifraud/application/validate-transaction.service';
import { EventBusModule } from './shared/infrastructure/event-bus/event-bus.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env-fraud',
    }),
    EventBusModule,
  ],
  controllers: [ValidateTransactionController],
  providers: [ValidateTransactionService],
})
export class AppModule {}
