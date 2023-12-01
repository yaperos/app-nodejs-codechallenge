import { Module } from '@nestjs/common'
import { TransferResolver } from './resolver'
import { TransferSqlRepository } from 'src/repos/transfer/repository'
import { TransferSqlModule } from 'src/repos/transfer/module'

@Module({
  imports: [TransferSqlModule],
  controllers: [],
  providers: [TransferSqlRepository, TransferResolver],
})
export class TransferApiModule { }
