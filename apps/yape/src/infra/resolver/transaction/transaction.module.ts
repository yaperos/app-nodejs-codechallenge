import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolver';
import { TransactionController } from './transaction.controller';
import { TransactionProxyModule } from '../../proxy/transaction.proxy.module';
import { AntiFraudService } from '../../service/anti-fraud.service';
import { KafkaProxyModule } from '../../proxy/kafka.proxy.module';

@Module({
  imports: [TransactionProxyModule, KafkaProxyModule],
  controllers: [TransactionController],
  providers: [TransactionResolver, AntiFraudService]
})
export class TransactionModule { }