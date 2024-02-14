import { DatabaseService } from '@app/common/database/database.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
