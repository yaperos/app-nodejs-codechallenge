import { CoreModule } from '@core/core.module';
import { Module } from '@nestjs/common';
import { TransactionModule } from '@transaction/transaction.module';
import { AntiFraudeModule } from 'anti-fraud';
import { ResolverModule } from 'resolver/transaction';


@Module({
  imports: [CoreModule,TransactionModule, ResolverModule, AntiFraudeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
