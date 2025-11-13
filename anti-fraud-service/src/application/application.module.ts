import { Module, forwardRef } from '@nestjs/common';
import { OnTransactionCreatedService } from './services/on-transaction-created.service';
import { MessagingModule } from '@adapters/messaging/messaging.module';

@Module({
  imports: [forwardRef(() => MessagingModule)],
  providers: [OnTransactionCreatedService],
  exports: [OnTransactionCreatedService],
})
export class ApplicationModule {}
