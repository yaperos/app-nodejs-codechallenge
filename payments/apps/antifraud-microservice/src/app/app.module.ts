import { Module } from '@nestjs/common';
import { ControllersModule } from './infrastructure/controllers.module';

@Module({
  imports: [
    ControllersModule,
  ]
})
export class AppModule {}
