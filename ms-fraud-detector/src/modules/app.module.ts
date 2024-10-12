import { Module } from '@nestjs/common';
import { FraudDetectorModule } from './fraud-detector/fraud-detector.module';

@Module({
  imports: [ FraudDetectorModule ],
})
export class AppModule {}
