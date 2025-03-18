import { Module } from '@nestjs/common';
import { KafkaModule } from './transports/kafka.module';
import { ExternalTransactionModule } from './external-transaction/external-transaction.module';
import { MasterTableModule } from './master-table/master-table.module';

@Module({
  imports: [KafkaModule, ExternalTransactionModule, MasterTableModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
