import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import {KafkaModule} from '../kafka/kafka.module';
import {StripeService} from "../stripe/stripe.service";

@Module({
  imports: [
    KafkaModule,
  ],
  providers: [TransactionService, StripeService],
  controllers: [TransactionController]
})
export class TransactionModule {}
