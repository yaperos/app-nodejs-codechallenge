import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [AccountsModule],
})
export class AppModule {}
