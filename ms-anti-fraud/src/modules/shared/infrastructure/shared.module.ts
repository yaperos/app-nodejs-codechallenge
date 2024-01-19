import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Services } from 'src/modules/shared/domain/services';

import { ExceptionBusHandler } from './exception-bus-handler';
import { Providers } from './providers';

@Module({
  imports: [CqrsModule],
  providers: [ExceptionBusHandler, ...Services, ...Providers],
  exports: [...Services],
})
export class SharedModule {}
