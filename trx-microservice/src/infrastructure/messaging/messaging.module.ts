import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateTransactionConsumer } from './transactions/update-transaction.consumer';
import { ApplicationModule } from '../../application/application.module';

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [UpdateTransactionConsumer],
})
export class MessagingModule {}