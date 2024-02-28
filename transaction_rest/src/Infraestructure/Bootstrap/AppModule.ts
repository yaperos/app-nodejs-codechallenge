import { Module } from '@nestjs/common';
import { TransactionModule } from '../Resolvers';

@Module({
  imports: [TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
