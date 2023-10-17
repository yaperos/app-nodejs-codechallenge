import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule} from 'src/kafka/kafka.module'
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [KafkaModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
