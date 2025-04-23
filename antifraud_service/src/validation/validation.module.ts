import { Module } from '@nestjs/common';
import { ValidationService } from './services/validation.service';
import { ValidationController } from './controllers/validation.controller';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [ValidationController],
  providers: [ValidationService],
  exports: [],
})
export class ValidationModule { }
