import { Module } from '@nestjs/common';
import { ValidationController } from './validation.controller';
import { ValidationService } from './validation.service';

@Module({
  controllers: [ValidationController],
  providers: [ValidationService],
})
export class ValidationModule {}
