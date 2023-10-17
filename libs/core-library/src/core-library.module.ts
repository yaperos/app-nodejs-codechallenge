import { Module } from '@nestjs/common';
import { CoreLibraryService } from './core-library.service';

@Module({
  providers: [CoreLibraryService],
  exports: [CoreLibraryService],
})
export class CoreLibraryModule {}
