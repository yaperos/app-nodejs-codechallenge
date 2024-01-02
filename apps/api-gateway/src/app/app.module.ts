import { Module } from '@nestjs/common';

import { TransferModule } from './transfer/transfer.module';

@Module({
  imports: [TransferModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
