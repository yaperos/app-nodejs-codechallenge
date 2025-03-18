import { Module } from '@nestjs/common';
import { ExternalTransactionController } from './external-transaction.controller';
import { ExternalTransactionService } from './external-transaction.service';
import { MasterTableModule } from 'src/master-table/master-table.module';
import { KafkaModule } from 'src/transports/kafka.module';

@Module({
  controllers: [ExternalTransactionController],
  providers: [ExternalTransactionService],
  imports: [KafkaModule, MasterTableModule],
})
export class ExternalTransactionModule {}
