import { Module } from '@nestjs/common';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [SecurityModule],
})
export class AppModule {}
