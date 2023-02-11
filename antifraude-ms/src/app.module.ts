import { Module } from '@nestjs/common';
import { AntiModule } from './anti/anti.module';

@Module({
  imports: [AntiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
