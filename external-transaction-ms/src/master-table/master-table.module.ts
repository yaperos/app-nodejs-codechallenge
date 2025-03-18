import { Module } from '@nestjs/common';
import { MasterTableController } from './master-table.controller';
import { MasterTableService } from './master-table.service';

@Module({
  controllers: [MasterTableController],
  providers: [MasterTableService],
  exports: [MasterTableService],
  imports: [],
})
export class MasterTableModule {}
