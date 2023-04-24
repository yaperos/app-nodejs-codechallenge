import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AliveHttpController } from './AliveHttpController';
import { HealthHttpController } from './HealthHttpController';

@Module({
  imports: [TerminusModule],
  controllers: [HealthHttpController, AliveHttpController],
})
export class CoreHttpModule {}
