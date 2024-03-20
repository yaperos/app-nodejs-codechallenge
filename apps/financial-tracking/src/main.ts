import { NestFactory } from '@nestjs/core';
import { FinancialTrackingModule } from './financial-tracking.module';

async function bootstrap() {
  const app = await NestFactory.create(FinancialTrackingModule);
  await app.listen(3001);
}
bootstrap();
