import { Module } from '@nestjs/common';
import { ApplicationCoreModule } from '../application-core/application-core.module';
import { EventController } from './controllers/event.controller';
import { TransactionResolver } from './resolvers/transaction.resolver';

@Module({
  controllers: [EventController],
  imports: [ApplicationCoreModule],
  providers: [TransactionResolver],
})
export class UserInterfaceModule {}
