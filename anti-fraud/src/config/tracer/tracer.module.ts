import { Global, Module } from '@nestjs/common';
import { TracerService } from './tracer.service';

@Global()
@Module({
  providers: [TracerService],
  exports: [TracerService],
})
export class TracerModule {}
