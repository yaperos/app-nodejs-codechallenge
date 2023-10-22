import { Module } from '@nestjs/common';
import { ValidationModule } from './validation/validation.module';

@Module({
  imports: [ValidationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
