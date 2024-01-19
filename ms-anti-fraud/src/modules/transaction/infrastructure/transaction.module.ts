import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { SharedModule } from 'src/modules/shared/infrastructure/shared.module';
import { EventHandlers } from 'src/modules/transaction/application/event-handlers';
import { UseCases } from 'src/modules/transaction/application/use-cases';

import { Controllers } from './controllers';

@Module({
  imports: [CqrsModule, ConfigModule, SharedModule],
  controllers: [...Controllers],
  providers: [...UseCases, ...EventHandlers],
})
export class TransactionModule {}
